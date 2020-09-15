public class Volume {
    private Integer sets;
    private Integer reps;
    private Double rpe;
    private Integer percentage;

    public Volume(int sets, int reps, double rpe, int percentage) {
        this.sets = sets;
        this.reps = reps;
        this.rpe = rpe;
        this.percentage = percentage;
    }

    public Volume() {
        this.sets = null;
        this.reps = null;
        this.rpe = null;
        this.percentage = null;
    }

    public int getSets() {
        return sets;
    }

    public int getReps() {
        return reps;
    }

    public double getRpe() {
        return rpe;
    }

    public int getPercentage() {
        return percentage;
    }

    public void setSets(Integer sets) {
        this.sets = sets;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public void setRpe(Double rpe) {
        this.rpe = rpe;
    }

    public void setPercentage(Integer percentage) {
        this.percentage = percentage;
    }
}

