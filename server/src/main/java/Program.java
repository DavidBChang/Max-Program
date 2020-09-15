import org.javatuples.Pair;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Program {
    private List<Pair<String, Day>> program;
    private Map<String, Integer> programNames;

    public Program() {
        program = new ArrayList<>();
        programNames = new HashMap<>();
    }

    public boolean checkDuplicate(String dayName) {
        return programNames.containsKey(dayName);
        /*
        boolean completed = false;

        for (int i = 0; i < programNames.size(); i++) {
            if (programNames.get(i).equals(dayName)) {//program.get(i).getValue0().equals(dayName)) {
                completed = true;
                break;
            }
        }
        return completed;*/
    }

    public void completeDay(String dayName, boolean override, Day day) {
        if (checkDuplicate(dayName)) {
            int i = programNames.get(dayName);
            program.set(i, program.get(i).setAt1(day));
        } else {
            Pair<String, Day> newDay = new Pair<>(dayName, day);
            program.add(newDay);
            programNames.put(dayName, programNames.size());
        }
        day.completeDay();
        /*
        if (override) {
            for (int i = 0; i < program.size(); i++) {
                if (program.get(i).getValue0().equals(dayName)) {
                    program.set(i, program.get(i).setAt1(day));
                    //completed = true;
                    break;
                }
            }
        } else {
            Pair<String, Day> newDay = new Pair<>(dayName, day);
            program.add(newDay);
        }
        day.completeDay();*/
    }

    public void chooseDay(int index, Day day) {
        day = program.get(index).getValue1();
    }

    public void removeDay(String dayName) {
        int index = programNames.get(dayName);
        program.remove(index);
        System.out.println();
    }
}
