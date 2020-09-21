import org.javatuples.Triplet;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Maxes {
    private List<Triplet<String, Integer, Integer>> maxes;
    private Set<String> maxesNames;

    public Maxes() {
        maxes = new ArrayList<>();
        maxes.add(new Triplet<>("Squat", 0, 0));
        maxes.add(new Triplet<>("Bench", 0, 0));
        maxes.add(new Triplet<>("Deadlift", 0, 0));
        maxesNames = new HashSet<>();
    }

    public List<Triplet<String, Integer, Integer>> getMaxes() {
        return maxes;
    }

    public Set<String> getMaxesNames() {
        return maxesNames;
    }

    public void addMax() {
        maxes.add(new Triplet<>("", 0, 0));
    }

    public void changeMaxName(String name, int index) {
        Triplet<String, Integer, Integer> newTriplet = maxes.get(index).setAt0(name);
        maxes.set(index, newTriplet);
    }

    public void changeMaxRM(int repMax, int index) {
        Triplet<String, Integer, Integer> newTriplet = maxes.get(index).setAt1(repMax);
        maxes.set(index, newTriplet);
    }

    public void changeMaxProgress(int progression, int index) {
        Triplet<String, Integer, Integer> newTriplet = maxes.get(index).setAt2(progression);
        maxes.set(index, newTriplet);
    }

    public void removeMax(int index) {
        maxes.remove(index);
    }

    public String toString() {
        return maxes.toString();
    }
}
