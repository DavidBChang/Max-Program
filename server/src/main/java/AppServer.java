import org.javatuples.*;
import spark.Spark;
import com.google.gson.Gson;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AppServer {
    static Day day = new Day();
    static Program program = new Program();
    static Maxes maxes = new Maxes();
    /*
    static List<Pair<String, List<Volume>>> day = new ArrayList<>();
    static List<Pair<String, List<Pair<String, List<Volume>>>>> program = new ArrayList<>();
    static List<Triplet<String, Integer, Integer>> maxes = new ArrayList<>();*/

    public static void main(String[] args) {
        CORSFilter corsFilter = new CORSFilter();
        corsFilter.apply();
        /*
        maxes.add(new Triplet<>("Squat", 0, 0));
        maxes.add(new Triplet<>("Bench", 0, 0));
        maxes.add(new Triplet<>("Deadlift", 0, 0));*/

        // add name http://localhost:4567/addname
        Spark.get("/addname", (req,res) -> {
            Gson gson = new Gson();
            day.addName();
            /*
            Pair<String, List<Volume>> newLift = new Pair<>("", new ArrayList<>());
            day.add(newLift);*/
            String json = gson.toJson(day);
            return json;
        });

        // change name localhost:4567/changename?newname=David&index=1
        Spark.get("/changename", (req,res) -> {
            String newName = req.queryParams("newname");
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            Gson gson = new Gson();
            Pair<String, List<Volume>> newPair = day.get(i).setAt0(newName);
            day.set(i, newPair); //= day.get(i).setAt0(newName);
            String json = gson.toJson(day);
            return json;
        });

        // remove name localhost:4567/removename?index=1
        Spark.get("/removename", (req,res) -> {
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            Gson gson = new Gson();
            day.remove(i);
            String json = gson.toJson(day);
            return json;
        });

        // add setsreps localhost:4567/addsetrep?index=1
        Spark.get("/addsetrep", (req,res) -> {
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            Gson gson = new Gson();
            day.get(i).getValue1().add(new Volume());
            String json = gson.toJson(day);
            return json;
        });

        // remove sets and reps localhost:4567/removesetrep?nameindex=1&srindex=1
        Spark.get("/removesetrep", (req,res) -> {
            String nameIndex = req.queryParams("nameindex");
            String setRepIndex = req.queryParams("srindex");
            int ni = Integer.parseInt(nameIndex);
            int sri = Integer.parseInt(setRepIndex);
            Gson gson = new Gson();
            day.get(ni).getValue1().remove(sri);
            String json = gson.toJson(day);
            return json;
        });

        // change sets localhost:4567/changesets?newsets=5&nameindex=1&setindex=1
        Spark.get("/changesets", (req,res) -> {
            String newSets = req.queryParams("newsets");
            String nameIndex = req.queryParams("nameindex");
            String setIndex = req.queryParams("setindex");
            Integer sets = null;
            Gson gson = new Gson();
            if (!newSets.isEmpty()) {
                sets = Integer.parseInt(newSets);
                int ni = Integer.parseInt(nameIndex);
                int si = Integer.parseInt(setIndex);
                day.get(ni).getValue1().get(si).setSets(sets);
                String json = gson.toJson(day);
                return json;
            }
            //int sets = Integer.parseInt(newSets);
            int ni = Integer.parseInt(nameIndex);
            int si = Integer.parseInt(setIndex);
            day.get(ni).getValue1().get(si).setSets(sets);
            String json = gson.toJson(day);
            return json;
        });

        // change reps localhost:4567/changereps?newreps=5&nameindex=1&repindex=1
        Spark.get("/changereps", (req,res) -> {
            String newReps = req.queryParams("newreps");
            String nameIndex = req.queryParams("nameindex");
            String repIndex = req.queryParams("repindex");
            Integer reps = null;
            Gson gson = new Gson();
            if (!newReps.isEmpty()) {
                reps = Integer.parseInt(newReps);
                int ni = Integer.parseInt(nameIndex);
                int ri = Integer.parseInt(repIndex);
                day.get(ni).getValue1().get(ri).setReps(reps);
                String json = gson.toJson(day);
                return json;
            }
            //int reps = Integer.parseInt(newReps);
            int ni = Integer.parseInt(nameIndex);
            int ri = Integer.parseInt(repIndex);
            day.get(ni).getValue1().get(ri).setReps(reps);
            String json = gson.toJson(day);
            return json;
        });

        // change rpe localhost:4567/changerpe?newrpe=5&nameindex=1&rpeindex=1
        Spark.get("/changerpe", (req,res) -> {
            String newRpe = req.queryParams("newrpe");
            String nameIndex = req.queryParams("nameindex");
            String rpeIndex = req.queryParams("rpeindex");
            double rpe;
            if (newRpe.charAt(newRpe.length() - 1) == ('D')) {
                rpe = Integer.parseInt(newRpe.substring(0, newRpe.length() - 1)) + 0.5;
            } else {
                rpe = Integer.parseInt(newRpe);
            }
            int ni = Integer.parseInt(nameIndex);
            int ri = Integer.parseInt(rpeIndex);
            Gson gson = new Gson();
            day.get(ni).getValue1().get(ri).setRpe(rpe);
            String json = gson.toJson(day);
            return json;
        });

        // change percentage localhost:4567/changepercent?newpercent=85&nameindex=1&percentindex=1
        Spark.get("/changepercent", (req,res) -> {
            String newPercent = req.queryParams("newpercent");
            String nameIndex = req.queryParams("nameindex");
            String percentIndex = req.queryParams("percentindex");
            Integer percent = null;
            Gson gson = new Gson();
            if (!newPercent.isEmpty()) {
                percent = Integer.parseInt(newPercent);
                int ni = Integer.parseInt(nameIndex);
                int pi = Integer.parseInt(percentIndex);
                day.get(ni).getValue1().get(pi).setPercentage(percent);
                String json = gson.toJson(day);
                return json;
            }
            //int percent = Integer.parseInt(newPercent);
            int ni = Integer.parseInt(nameIndex);
            int pi = Integer.parseInt(percentIndex);
            day.get(ni).getValue1().get(pi).setPercentage(percent);
            String json = gson.toJson(day);
            return json;
        });

        // check duplicate day
        Spark.get("/checkduplicate", (req,res) -> {   // replace old day
            String dayName = req.queryParams("dayname");
            Gson gson = new Gson();
            boolean completed = false;

            for (int i = 0; i < program.size(); i++) {
                if (program.get(i).getValue0().equals(dayName)) {
                    //program.set(i, program.get(i).setAt1(day));
                    completed = true;
                    break;
                }
            }

            String json = gson.toJson(completed);
            return json;
        });

        Spark.get("/test", (req,res) -> {   // replace old day
            String dayName = req.queryParams("dayname");
            Gson gson = new Gson();
            if (!program.isEmpty()) {
                String json = gson.toJson(program.get(0).getValue0().equals(dayName));
                //String json = gson.toJson(program.get(0).getValue0().equals(dayName));
                return json;
            }
            return 1;
        });

        // complete day localhost:4567/complete?dayname=Monday&override=true
        Spark.get("/complete", (req,res) -> {   // replace old day
            String dayName = req.queryParams("dayname");
            String override = req.queryParams("override");
            Gson gson = new Gson();
            //boolean completed = false;
            //Pair<String, List<Pair<String, List<Pair<String, List<Volume>>>>>> result = new Pair<>("completed", null);
            if (override.equals("true")) {
                for (int i = 0; i < program.size(); i++) {
                    if (program.get(i).getValue0().equals(dayName)) {
                        program.set(i, program.get(i).setAt1(day));
                        //completed = true;
                        break;
                    }
                }
            } else {
                Pair<String, List<Pair<String, List<Volume>>>> newDay = new Pair<>(dayName, day);
                program.add(newDay);
            }
            day = new ArrayList<>();
            String json = gson.toJson(program);
            return json;
        });

        // verify day
        // check that name is filled and every percentage is for a lift with a max
        Spark.get("/verify", (req,res) -> {
            //String dayName = req.queryParams("dayname");
            Gson gson = new Gson();
            List<String> verifyMaxes = new ArrayList<>();
            for (int i = 0; i < maxes.size(); i++) {
                verifyMaxes.add(maxes.get(i).getValue0());
            }
            String json = gson.toJson(verifyMaxes);
            return json;
        });

        // choose day
        Spark.get("/day", (req,res) -> {
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            Gson gson = new Gson();
            day = program.get(i).getValue1();
            String json = gson.toJson(day); // keep day here
            return json;
        });

        // remove day
        Spark.get("/removeday", (req,res) -> {
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            Gson gson = new Gson();
            program.remove(i);
            String json = gson.toJson(program);
            return json;
        });

        // add max http://localhost:4567/addmax
        Spark.get("/addmax", (req,res) -> {
            Gson gson = new Gson();
            maxes.add(new Triplet<>("", 0, 0));
            String json = gson.toJson(maxes);
            return json;
        });

        // change max name http://localhost:4567/changemaxname?name=Bench&index=1
        Spark.get("/changemaxname", (req,res) -> {
            String index = req.queryParams("index");
            String name = req.queryParams("name");
            int i = Integer.parseInt(index);
            Gson gson = new Gson();
            Triplet<String, Integer, Integer> newTriplet = maxes.get(i).setAt0(name);
            maxes.set(i, newTriplet);
            String json = gson.toJson(maxes);
            return json;
        });

        // change max 1rm http://localhost:4567/changemaxrm?rm=100&index=1
        Spark.get("/changemaxrm", (req,res) -> {
            String rm = req.queryParams("rm");
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            int repMax = Integer.parseInt(rm);
            Gson gson = new Gson();
            Triplet<String, Integer, Integer> newTriplet = maxes.get(i).setAt1(repMax);
            maxes.set(i, newTriplet);
            String json = gson.toJson(maxes);
            return json;
        });

        // change max progression http://localhost:4567/changemaxprog?prog=100&index=1
        Spark.get("/changemaxprog", (req,res) -> {
            String prog = req.queryParams("prog");
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            int progression = Integer.parseInt(prog);
            Gson gson = new Gson();
            Triplet<String, Integer, Integer> newTriplet = maxes.get(i).setAt2(progression);
            maxes.set(i, newTriplet);
            String json = gson.toJson(maxes);
            return json;
        });

        // remove max http://localhost:4567/removemax?index=1
        Spark.get("/removemax", (req,res) -> {
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            Gson gson = new Gson();
            maxes.remove(i);
            String json = gson.toJson(maxes);
            return json;
        });
    }
}
