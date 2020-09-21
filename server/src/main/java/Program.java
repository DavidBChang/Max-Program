import org.javatuples.Pair;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Program {
    private List<Pair<String, List<Pair<String, List<Volume>>>>> program;
    private Map<String, Integer> dayNames;

    public Program() {
        program = new ArrayList<>();
        dayNames = new HashMap<>();
    }

    public Program(List<Pair<String, List<Pair<String, List<Volume>>>>> program, Map<String, Integer> dayNames) {
        this.program = program;
        this.dayNames = dayNames;
    }

    public Program getProgram() {
        return new Program(program, dayNames);
    }

    public List<Pair<String, List<Pair<String, List<Volume>>>>> getDays() {
        return program;
    }

    public boolean checkDuplicate(String dayName) {
        return dayNames.containsKey(dayName);
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

    public void completeDay(String dayName, List<Pair<String, List<Volume>>> day) {
        if (checkDuplicate(dayName)) {
            int i = dayNames.get(dayName);
            program.set(i, program.get(i).setAt1(day));
        } else {
            Pair<String, List<Pair<String, List<Volume>>>> newDay = new Pair<>(dayName, day);
            program.add(newDay);
            dayNames.put(dayName, dayNames.size());
        }
        //day.completeDay();
        //return program;
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

    public void completeProgram() {
        program = new ArrayList<>();
    }

    public Day chooseDay(int index) {
        List<Pair<String, List<Volume>>> day = program.get(index).getValue1();
        //day = program.get(index).getValue1();
        return new Day(day);
    }

    public void removeDay(String dayName) {
        int index = dayNames.get(dayName);
        program.remove(index);
    }

    public String toString() {
        return program.toString();
    }
}
