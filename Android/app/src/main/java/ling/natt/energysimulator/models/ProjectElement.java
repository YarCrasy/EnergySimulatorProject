package ling.natt.energysimulator.models;


public class ProjectElement {

    private Long id;
    private Project project;
    private Element element;
    private Integer unidades = 1;

    public ProjectElement(Project project, Element element, Integer unidades) {
        this.project = project;
        this.element = element;
        this.unidades = unidades;
    }

    // getters y setters
    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return this.project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Element getElement() {
        return this.element;
    }

    public void setElement(Element element) {
        this.element = element;
    }

    public Integer getUnidades() {
        return this.unidades;
    }

    public void setUnidades(Integer unidades) {
        this.unidades = unidades;
    }

    // toString
    @Override
    public String toString() {
        return "{" +
                "unidades='" + getUnidades() + "'" +
                "}";
    }
}
