import org.javatuples.*;
import java.util.ArrayList;
import java.util.List;

public class Day {
    private List<Pair<String, List<Volume>>> day;

    public Day() {
        this.day = new ArrayList<>();
    }

    public void addName() {
        Pair<String, List<Volume>> newLift = new Pair<>("", new ArrayList<>());
        day.add(newLift);
    }

    public void changeName(String newName, int index) {
        Pair<String, List<Volume>> newPair = day.get(index).setAt0(newName);
        day.set(index, newPair);
    }

    public void removeName(int index) {
        day.remove(index);
    }

    public void addSetsReps(int index) {
        day.get(index).getValue1().add(new Volume());
    }

    public void removeSetsReps(int nameIdx, int setsRepsIdx) {
        day.get(nameIdx).getValue1().remove(setsRepsIdx);
    }

    public void changeSets(String newSets, int nameIndex, int setIndex) {
        Integer sets = null;
        if (!newSets.isEmpty()) {
            sets = Integer.parseInt(newSets);
            day.get(nameIndex).getValue1().get(setIndex).setSets(sets);
        }
        day.get(nameIndex).getValue1().get(setIndex).setSets(sets);
    }

    public void changeReps(String newReps, int nameIndex, int repIndex) {
        Integer reps = null;
        if (!newReps.isEmpty()) {
            reps = Integer.parseInt(newReps);
            day.get(nameIndex).getValue1().get(repIndex).setReps(reps);
        }
        day.get(nameIndex).getValue1().get(repIndex).setReps(reps);
    }

    public void changeRpe(String newRpe, int nameIndex, int rpeIndex) {
        double rpe;
        if (newRpe.charAt(newRpe.length() - 1) == ('D')) {
            rpe = Integer.parseInt(newRpe.substring(0, newRpe.length() - 1)) + 0.5;
        } else {
            rpe = Integer.parseInt(newRpe);
        }
        day.get(nameIndex).getValue1().get(rpeIndex).setRpe(rpe);
    }

    public void changePercent(String newPercent, int nameIndex, int percentIndex) {
        Integer reps = null;
        if (!newPercent.isEmpty()) {
            reps = Integer.parseInt(newPercent);
            day.get(nameIndex).getValue1().get(percentIndex).setReps(reps);
        }
        day.get(nameIndex).getValue1().get(percentIndex).setReps(reps);
    }

    public void completeDay() {
        day = new ArrayList<>();
    }
}
