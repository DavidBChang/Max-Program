import org.javatuples.*;
import spark.Spark;
import com.google.gson.Gson;
import java.util.List;

public class AppServer {
    static Day day = new Day();
    static Program program = new Program();
    static Maxes maxes = new Maxes();
    static Home home = new Home();

    public static void main(String[] args) {
        CORSFilter corsFilter = new CORSFilter();
        corsFilter.apply();

        // add name http://localhost:4567/addname
        Spark.get("/addname", (req,res) -> {
            Gson gson = new Gson();
            day.addName();
            String json = gson.toJson(day.getDay());
            return json;
        });

        // change name localhost:4567/changename?newname=David&index=1
        Spark.get("/changename", (req,res) -> {
            String newName = req.queryParams("newname");
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            Gson gson = new Gson();
            day.changeName(newName, i);
            String json = gson.toJson(day.getDay());
            return json;
        });

        // remove name localhost:4567/removename?index=1
        Spark.get("/removename", (req,res) -> {
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            Gson gson = new Gson();
            day.removeName(i);
            String json = gson.toJson(day.getDay());
            return json;
        });

        // add setsreps localhost:4567/addsetrep?index=1
        Spark.get("/addsetrep", (req,res) -> {
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            Gson gson = new Gson();
            day.addSetsReps(i);
            String json = gson.toJson(day.getDay());
            return json;
        });

        // remove sets and reps localhost:4567/removesetrep?nameindex=1&srindex=1
        Spark.get("/removesetrep", (req,res) -> {
            String nameIndex = req.queryParams("nameindex");
            String setRepIndex = req.queryParams("srindex");
            int ni = Integer.parseInt(nameIndex);
            int sri = Integer.parseInt(setRepIndex);
            Gson gson = new Gson();
            day.removeSetsReps(ni, sri);
            String json = gson.toJson(day.getDay());
            return json;
        });

        // change sets localhost:4567/changesets?newsets=5&nameindex=1&setindex=1
        Spark.get("/changesets", (req,res) -> {
            String newSets = req.queryParams("newsets");
            String nameIndex = req.queryParams("nameindex");
            String setIndex = req.queryParams("setindex");
            int ni = Integer.parseInt(nameIndex);
            int si = Integer.parseInt(setIndex);
            Gson gson = new Gson();
            day.changeSets(newSets, ni, si);
            String json = gson.toJson(day.getDay());
            return json;
        });

        // change reps localhost:4567/changereps?newreps=5&nameindex=1&repindex=1
        Spark.get("/changereps", (req,res) -> {
            String newReps = req.queryParams("newreps");
            String nameIndex = req.queryParams("nameindex");
            String repIndex = req.queryParams("repindex");
            int ni = Integer.parseInt(nameIndex);
            int ri = Integer.parseInt(repIndex);
            Gson gson = new Gson();
            day.changeReps(newReps, ni, ri);
            String json = gson.toJson(day.getDay());
            return json;
        });

        // change rpe localhost:4567/changerpe?newrpe=5&nameindex=1&rpeindex=1
        Spark.get("/changerpe", (req,res) -> {
            String newRpe = req.queryParams("newrpe");
            String nameIndex = req.queryParams("nameindex");
            String rpeIndex = req.queryParams("rpeindex");
            int ni = Integer.parseInt(nameIndex);
            int ri = Integer.parseInt(rpeIndex);
            Gson gson = new Gson();
            day.changeRpe(newRpe, ni, ri);
            String json = gson.toJson(day.getDay());
            return json;
        });

        // change percentage localhost:4567/changepercent?newpercent=85&nameindex=1&percentindex=1
        Spark.get("/changepercent", (req,res) -> {
            String newPercent = req.queryParams("newpercent");
            String nameIndex = req.queryParams("nameindex");
            String percentIndex = req.queryParams("percentindex");
            int ni = Integer.parseInt(nameIndex);
            int pi = Integer.parseInt(percentIndex);
            day.changePercent(newPercent, ni, pi);
            Gson gson = new Gson();
            String json = gson.toJson(day.getDay());
            return json;
        });

        // check duplicate day
        Spark.get("/checkduplicate", (req,res) -> {   // replace old day
            String dayName = req.queryParams("dayname");
            Gson gson = new Gson();
            boolean completed = program.checkDuplicate(dayName);
            String json = gson.toJson(completed);
            return json;
        });

        // complete day localhost:4567/complete?dayname=Monday&override=true
        Spark.get("/complete", (req,res) -> {   // replace old day
            String dayName = req.queryParams("dayname");
            String override = req.queryParams("override");
            Gson gson = new Gson();
            Day dayCopy = new Day(); //day.makeCopy();
            program.completeDay(dayName, day.getDay());
            day.completeDay();
            String json = gson.toJson(program.getDays());//.getProgram());
            return json;
        });

        // verify day
        // check that name is filled and every percentage is for a lift with a max
        Spark.get("/verify", (req,res) -> {
            Gson gson = new Gson();
            String json = gson.toJson(maxes.getMaxesNames());
            return json;
        });

        // choose day
        Spark.get("/day", (req,res) -> {
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            Gson gson = new Gson();
            day = program.chooseDay(i);
            String json = gson.toJson(day.getDay()); // keep day here
            return json;
        });

        // remove day
        Spark.get("/removeday", (req,res) -> {
            String dayName = req.queryParams("dayname");
            Gson gson = new Gson();
            program.removeDay(dayName);
            String json = gson.toJson(program.getProgram());
            return json;
        });

        // add max http://localhost:4567/addmax
        Spark.get("/addmax", (req,res) -> {
            Gson gson = new Gson();
            maxes.addMax();
            String json = gson.toJson(maxes.getMaxes());
            return json;
        });

        // change max name http://localhost:4567/changemaxname?name=Bench&index=1
        Spark.get("/changemaxname", (req,res) -> {
            String index = req.queryParams("index");
            String name = req.queryParams("name");
            int i = Integer.parseInt(index);
            Gson gson = new Gson();
            maxes.changeMaxName(name, i);
            String json = gson.toJson(maxes.getMaxes());
            return json;
        });

        // change max 1rm http://localhost:4567/changemaxrm?rm=100&index=1
        Spark.get("/changemaxrm", (req,res) -> {
            String rm = req.queryParams("rm");
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            int repMax = Integer.parseInt(rm);
            Gson gson = new Gson();
            maxes.changeMaxRM(repMax, i);
            String json = gson.toJson(maxes.getMaxes());
            return json;
        });

        // change max progression http://localhost:4567/changemaxprog?prog=100&index=1
        Spark.get("/changemaxprog", (req,res) -> {
            String prog = req.queryParams("prog");
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            int progression = Integer.parseInt(prog);
            Gson gson = new Gson();
            maxes.changeMaxProgress(progression, i);
            String json = gson.toJson(maxes.getMaxes());
            return json;
        });

        // remove max http://localhost:4567/removemax?index=1
        Spark.get("/removemax", (req,res) -> {
            String index = req.queryParams("index");
            int i = Integer.parseInt(index);
            Gson gson = new Gson();
            maxes.removeMax(i);
            String json = gson.toJson(maxes.getMaxes());
            return json;
        });

        // check duplicate program
        Spark.get("/checkduplicateprogram", (req,res) -> {   // replace old day
            String dayName = req.queryParams("programname");
            Gson gson = new Gson();
            boolean completed = home.checkDuplicate(dayName);
            String json = gson.toJson(completed);
            return json;
        });

        // complete day localhost:4567/complete?dayname=Monday&override=true
        Spark.get("/completeprogram", (req,res) -> {   // replace old day
            String programName = req.queryParams("programname");
            Gson gson = new Gson();
            home.completeProgram(programName, program.getProgram(), maxes.makeCopy());
            program = new Program();    // need to change this for day
            String json = gson.toJson(home.getHome());
            return json;
        });

        // choose program
        Spark.get("/program", (req,res) -> {
            String programName = req.queryParams("programname");
            Gson gson = new Gson();
            int i = home.getIndex(programName);
            List<Pair<String, List<Pair<String, List<Volume>>>>> days = home.chooseProgram(i).getDays();
            String json = gson.toJson(days);
            return json;
        });

        // choose program maxes
        Spark.get("/programmaxes", (req,res) -> {
            String programName = req.queryParams("programname");
            Gson gson = new Gson();
            String json = gson.toJson(home.chooseMaxes(programName));
            return json;
        });
    }
}
