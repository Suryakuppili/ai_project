import pypdf
import hashlib
import re

pdf_path = r"c:\Users\surya\Downloads\cdn.digialm.com__per_g01_pub_1480_touchstone_AssessmentQPHTMLMode1__1480O2621_1480O2621S14D3110_17793566382654338_961093040188_1480O2621S14D3110E1.html#.pdf"
reader = pypdf.PdfReader(pdf_path)

tick_hash = "918813cb365fee51874d043bfd595514"

def mult_matrix(A, B):
    a1, b1, c1, d1, e1, f1 = A
    a2, b2, c2, d2, e2, f2 = B
    return [
        a1*a2 + b1*c2, a1*b2 + b1*d2,
        c1*a2 + d1*c2, c1*b2 + d1*d2,
        e1*a2 + f1*c2 + e2, e1*b2 + f1*d2 + f2
    ]

def extract_elements_from_stream(stream, resources, cm, options_out, ticks_out):
    try:
        data = stream.get_data().decode('latin-1')
    except Exception:
        return
    tokens = re.split(r'\s+', data)
    state_stack = []
    
    i = 0
    while i < len(tokens):
        t = tokens[i]
        if t == 'q':
            state_stack.append(list(cm))
        elif t == 'Q':
            if state_stack:
                cm = state_stack.pop()
        elif t == 'cm':
            if i >= 6:
                try:
                    op_matrix = [float(x) for x in tokens[i-6:i]]
                    cm = mult_matrix(op_matrix, cm)
                except ValueError:
                    pass
        elif t == 'Do':
            name = tokens[i-1]
            if resources and '/XObject' in resources:
                xobjs = resources['/XObject'].get_object()
                if name in xobjs:
                    obj = xobjs[name].get_object()
                    if obj.get('/Subtype') == '/Image':
                        h = hashlib.md5(obj.get_data()).hexdigest()
                        if h == tick_hash:
                            ticks_out.append({
                                "x": cm[4],
                                "y": cm[5]
                            })
                    elif obj.get('/Subtype') == '/Form':
                        form_res = obj.get('/Resources')
                        if form_res:
                            extract_elements_from_stream(obj, form_res.get_object(), cm, options_out, ticks_out)
        elif t == 'Tj' or t == 'TJ':
            tm = [1.0, 0.0, 0.0, 1.0, 0.0, 0.0]
            for j in range(i-1, max(0, i-20), -1):
                if tokens[j] == 'Tm':
                    try:
                        tm = [float(x) for x in tokens[j-6:j]]
                    except ValueError:
                        pass
                    break
            
            text_val = tokens[i-1]
            if text_val.startswith('<') and text_val.endswith('>'):
                if abs(tm[4] - 91.5625) < 1.0 or abs(tm[4] - 93.953125) < 1.0:
                    hex_str = text_val[1:-1]
                    opt_char = None
                    if '0014' in hex_str: opt_char = '1'
                    elif '0015' in hex_str: opt_char = '2'
                    elif '0016' in hex_str: opt_char = '3'
                    elif '0017' in hex_str: opt_char = '4'
                    
                    if opt_char:
                        comb = mult_matrix(tm, cm)
                        options_out.append({
                            "opt": opt_char,
                            "x": comb[4],
                            "y": comb[5]
                        })
        i += 1

results = []
correct_answers_count = 0

for page_idx in range(len(reader.pages)):
    page = reader.pages[page_idx]
    
    text = page.extract_text()
    q_ids = re.findall(r"Question ID\s*:\s*(\d+)", text)
    ch_opts = re.findall(r"Chosen Option\s*:\s*(\d+|--|-)", text)
    page_questions = []
    for q, opt in zip(q_ids, ch_opts):
        page_questions.append({"q_id": q, "chosen": opt})
        
    if not page_questions:
        continue
        
    options = []
    ticks = []
    resources = page.get('/Resources')
    if resources:
        resources = resources.get_object()
        contents = page['/Contents']
        if isinstance(contents, list):
            for c in contents:
                extract_elements_from_stream(c, resources, [1.0, 0.0, 0.0, 1.0, 0.0, 0.0], options, ticks)
        elif contents:
            extract_elements_from_stream(contents, resources, [1.0, 0.0, 0.0, 1.0, 0.0, 0.0], options, ticks)
            
    for q_idx, q_info in enumerate(page_questions):
        q_options = options[4*q_idx : 4*q_idx+4]
        if q_idx < len(ticks) and len(q_options) == 4:
            tick = ticks[q_idx]
            dists = []
            for opt in q_options:
                dist = abs(opt['y'] - tick['y'])
                dists.append((dist, opt['opt']))
            dists.sort()
            correct_opt = dists[0][1]
        else:
            correct_opt = "N/A"
            
        chosen_opt = q_info['chosen']
        is_correct = (chosen_opt == correct_opt)
        if is_correct:
            correct_answers_count += 1
            
        results.append({
            "num": len(results) + 1,
            "page": page_idx + 1,
            "q_id": q_info['q_id'],
            "chosen": chosen_opt,
            "correct": correct_opt,
            "status": "Correct" if is_correct else "Incorrect"
        })

# Subject wise split:
# Q1-80: Mathematics
# Q81-120: Physics
# Q121-160: Chemistry
math_correct = sum(1 for r in results[:80] if r['status'] == 'Correct')
physics_correct = sum(1 for r in results[80:120] if r['status'] == 'Correct')
chem_correct = sum(1 for r in results[120:160] if r['status'] == 'Correct')

print(f"MATH: {math_correct} / 80")
print(f"PHYSICS: {physics_correct} / 40")
print(f"CHEMISTRY: {chem_correct} / 40")
