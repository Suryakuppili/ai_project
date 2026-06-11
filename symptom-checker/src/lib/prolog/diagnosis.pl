:- dynamic known/2.

% ===============================
% RESET
% ===============================
reset :- retractall(known(_, _)).

% ===============================
% ADD ANSWERS
% ===============================
add_answer(Key, Value) :-
    retractall(known(Key, _)),
    assertz(known(Key, Value)).

% ===============================
% DYNAMIC QUESTION FLOW
% ===============================

next_question(Q) :-
    % 1. Get the sub_region and initial_symptom
    known(sub_region, SubRegion),
    % 2. Find a question relevant to that sub_region that hasn't been answered
    relevant_question(SubRegion, QKey, QText, Type, Options),
    \+ known(QKey, _),
    Q = question(QKey, QText, Type, Options),
    !.

next_question(none).

% ===============================
% RELEVANT QUESTIONS BY SUB-REGION
% ===============================

% --- EYES ---
relevant_question("Eyes", eye_pain, "Do you have pain in your eye?", yesno, ["Yes","No"]).
relevant_question("Eyes", blurry_vision, "Is your vision blurry?", yesno, ["Yes","No"]).
relevant_question("Eyes", light_sensitivity, "Are your eyes sensitive to light?", yesno, ["Yes","No"]).
relevant_question("Eyes", eye_discharge, "Is there any discharge from your eye?", yesno, ["Yes","No"]).
relevant_question("Eyes", eye_redness, "Is the white part of your eye red?", yesno, ["Yes","No"]).

% --- EARS ---
relevant_question("Ears", ear_pain, "Do you have sharp pain in your ear?", yesno, ["Yes","No"]).
relevant_question("Ears", hearing_loss, "Are you experiencing any hearing loss?", yesno, ["Yes","No"]).
relevant_question("Ears", ear_ringing, "Do you hear a ringing sound (tinnitus)?", yesno, ["Yes","No"]).
relevant_question("Ears", ear_discharge, "Is there any fluid draining from the ear?", yesno, ["Yes","No"]).

% --- HEART (Cardiovascular) ---
relevant_question("Cardiovascular", chest_tightness, "Does your chest feel tight or heavy?", yesno, ["Yes","No"]).
relevant_question("Cardiovascular", palpitations, "Do you feel your heart racing or skipping beats?", yesno, ["Yes","No"]).
relevant_question("Cardiovascular", radiating_pain, "Does the pain spread to your left arm or jaw?", yesno, ["Yes","No"]).
relevant_question("Cardiovascular", shortness_breath, "Are you finding it hard to breathe?", yesno, ["Yes","No"]).

% --- LUNGS (Respiratory) ---
relevant_question("Respiratory", persistent_cough, "Do you have a persistent cough?", yesno, ["Yes","No"]).
relevant_question("Respiratory", wheezing, "Do you hear a whistling sound (wheezing) when you breathe?", yesno, ["Yes","No"]).
relevant_question("Respiratory", cough_blood, "Are you coughing up any blood?", yesno, ["Yes","No"]).
relevant_question("Respiratory", fever, "Do you have a high fever?", yesno, ["Yes","No"]).

% --- STOMACH (Digestive) ---
relevant_question("UpperAbdomen", heartburn, "Do you have a burning sensation in your chest or throat?", yesno, ["Yes","No"]).
relevant_question("UpperAbdomen", nausea, "Are you feeling nauseous?", yesno, ["Yes","No"]).
relevant_question("UpperAbdomen", bloating, "Do you feel excessively bloated?", yesno, ["Yes","No"]).
relevant_question("LowerAbdomen", diarrhea, "Are you experiencing diarrhea?", yesno, ["Yes","No"]).
relevant_question("LowerAbdomen", blood_stool, "Is there any blood in your stool?", yesno, ["Yes","No"]).

% --- JOINTS/MUSCLES ---
relevant_question("Joints", joint_swelling, "Is the joint visibly swollen?", yesno, ["Yes","No"]).
relevant_question("Joints", morning_stiffness, "Is the joint stiff in the morning?", yesno, ["Yes","No"]).
relevant_question("Muscles", muscle_weakness, "Do you feel significant muscle weakness?", yesno, ["Yes","No"]).

% ===============================
% DISEASE MATCHING RULES
% ===============================

% --- Eye Diseases ---
match("Conjunctivitis (Pink Eye)") :- 
    known(sub_region, "Eyes"), (known(initial_symptom, "Redness") ; known(eye_redness, "Yes")), known(eye_discharge, "Yes").
match("Glaucoma") :- 
    known(sub_region, "Eyes"), known(eye_pain, "Yes"), known(blurry_vision, "Yes").
match("Dry Eye Syndrome") :- 
    known(sub_region, "Eyes"), known(initial_symptom, "Dryness"), \+ known(eye_discharge, "Yes").

% --- Ear Diseases ---
match("Otitis Media (Ear Infection)") :- 
    known(sub_region, "Ears"), known(ear_pain, "Yes"), known(fever, "Yes").
match("Tinnitus") :- 
    known(sub_region, "Ears"), known(ear_ringing, "Yes").

% --- Heart Diseases ---
match("Angina / Potential Heart Attack") :- 
    known(sub_region, "Cardiovascular"), (known(initial_symptom, "Heavy chest pressure") ; known(chest_tightness, "Yes")), known(radiating_pain, "Yes").
match("Arrhythmia") :- 
    known(sub_region, "Cardiovascular"), known(palpitations, "Yes").

% --- Lung Diseases ---
match("Bronchitis") :- 
    known(sub_region, "Respiratory"), known(persistent_cough, "Yes"), known(wheezing, "Yes").
match("Pneumonia") :- 
    known(sub_region, "Respiratory"), known(persistent_cough, "Yes"), known(fever, "Yes").

% --- Stomach Diseases ---
match("GERD (Acid Reflux)") :- 
    known(sub_region, "UpperAbdomen"), known(heartburn, "Yes"), known(nausea, "Yes").
match("Gastroenteritis (Stomach Flu)") :- 
    known(sub_region, "LowerAbdomen"), known(diarrhea, "Yes"), known(nausea, "Yes").

% --- Muscle/Joint ---
match("Rheumatoid Arthritis") :- 
    known(sub_region, "Joints"), known(joint_swelling, "Yes"), known(morning_stiffness, "Yes").
match("Muscle Strain") :- 
    known(sub_region, "Muscles"), known(muscle_weakness, "Yes"), \+ known(fever, "Yes").

% ===============================
% RESULTS
% ===============================

get_result(Results) :-
    findall(Disease, match(Disease), Raw),
    sort(Raw, Results).