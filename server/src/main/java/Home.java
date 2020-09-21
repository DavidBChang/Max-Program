import org.javatuples.Pair;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Home {
    private List<Pair<String, Program>> programList;
    private Map<String, Integer> programNames;

    public Home() {
        programList = new ArrayList<>();
        programNames = new HashMap<>();
    }

    public List<Pair<String, Program>> getHome() {
        return programList; // only want to display list on homescreen
    }

    public Integer getIndex(String programName) {
        return programNames.get(programName);
    }

    public boolean checkDuplicate(String programName) {
        return programNames.containsKey(programName);
    }

    public void completeProgram(String programName, Program programCopy) { //Program
        if (checkDuplicate(programName)) {
            int i = programNames.get(programName);
            programList.set(i, programList.get(i).setAt1(programCopy));
        } else {
            Pair<String, Program> newProgram = new Pair<>(programName, programCopy);
            programList.add(newProgram);
            programNames.put(programName, programNames.size());
        }
    }

    public Program chooseProgram(int index) {
        return programList.get(index).getValue1().getProgram();
    }
}
