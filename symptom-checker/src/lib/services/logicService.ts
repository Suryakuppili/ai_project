import { execSync } from "child_process";
import path from "path";

class LogicService {
  private prologFilePath: string;
  private swiplPath: string = `"C:\\Program Files\\swipl\\bin\\swipl.exe"`;

  constructor() {
    this.prologFilePath = path.join(process.cwd(), "src/lib/prolog/diagnosis.pl").replace(/\\/g, "/");
  }

  private runProlog(query: string): string {
    try {
      const cmd = `${this.swiplPath} -q -s "${this.prologFilePath}" -g "${query},halt."`;
      return execSync(cmd, { encoding: "utf8" }).trim();
    } catch (error: any) {
      console.error("Prolog Execution Error:", error.message);
      return "";
    }
  }

  getNextQuestion(answers: Record<string, string>): any {
    let assertions = "reset";
    for (const [key, val] of Object.entries(answers)) {
      assertions += `, add_answer('${key}', "${val}")`;
    }

    const query = `${assertions}, next_question(Q), (Q = none -> write('DONE') ; (Q = question(Key, Text, Type, Options), format('~w|~w|~w|~w', [Key, Text, Type, Options])))`;
    
    const output = this.runProlog(query);

    if (output === "DONE" || !output) {
      return { done: true };
    }

    const parts = output.split("|");
    if (parts.length >= 4) {
      const [key, text, type, optionsStr] = parts;
      const options = optionsStr.replace(/[\[\]]/g, "").split(",").map(s => s.trim().replace(/['"]/g, ""));
      return {
        question: {
          key: key,
          text: text.replace(/['"]/g, ""),
          type: type,
          options: options.filter(o => o !== "")
        }
      };
    }

    return { done: true };
  }

  getResults(answers: Record<string, string>): any {
    let assertions = "reset";
    for (const [key, val] of Object.entries(answers)) {
      assertions += `, add_answer('${key}', "${val}")`;
    }

    const query = `${assertions}, get_result(R), write(R)`;
    const output = this.runProlog(query);

    if (!output || output === "[]") return { results: [] };

    // Output is like: [Conjunctivitis (Pink Eye), Dry Eye Syndrome]
    // We parse the list of strings
    const results = output.replace(/[\[\]]/g, "").split(",").map(name => ({
      disease: name.trim().replace(/['"]/g, ""),
      score: 100 // Default to 100 since they matched and user said no need of score
    }));

    return { results };
  }
}

export const logicService = new LogicService();
