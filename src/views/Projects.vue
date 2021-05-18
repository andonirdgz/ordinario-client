<template>
  <div>
    <div>
      <div class="jumbotron my-4">
        <h1 class="display-4 text-center">Proyectos</h1>
        <p class="lead blockquote text-center">
          Estos son algunos de mis proyectos personales en los que he trabajado en mi
          tiempo libre y demuestran mis conocimientos en el desarrollo de software.
        </p>
      </div>
    </div>
    <v-container fluid>
      <v-row dense>
        <v-col v-for="project in projects" :key="project._id" cols="4">
          <v-hover>
            <template v-slot:default="{ hover }">
              <v-card class="rounded-lg">
                <v-img
                  class="white--text align-end"
                  gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                  height="350px"
                  :src="getImage(project.image)"
                >
                  <v-card-title v-text="project.title"></v-card-title>
                  <v-card-subtitle class="white--text">{{
                    project.subtitle
                  }}</v-card-subtitle>
                  <v-fade-transition>
                    <v-overlay v-if="hover" absolute color="#000000">
                      <v-btn
                        icon
                        x-large
                        fab
                        class="ma-5"
                        color="amber darken-1"
                        @click="showEditDialog(project)"
                        ><v-icon>mdi-pencil-box-outline</v-icon></v-btn
                      >
                      <v-btn
                        icon
                        x-large
                        fab
                        class="ma-5"
                        color="red darken-1"
                        @click="showConfirmation(project)"
                        ><v-icon>mdi-trash-can-outline</v-icon></v-btn
                      >
                    </v-overlay>
                  </v-fade-transition>
                </v-img>
              </v-card>
            </template>
          </v-hover>
        </v-col>
        <v-col cols="4">
          <v-btn
            outlined
            x-large
            block
            height="350"
            class="rounded-lg"
            @click="dialog = true"
          >
            <v-icon color="white" x-large>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">{{
                edit ? "Editar Proyecto" : "Crear Proyecto"
              }}</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="title"
                      label="Titulo del proyecto"
                      required
                      outlined
                      dense
                      class="rounded-pill"
                      :rules="nameRules"
                      :counter="20"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-file-input
                      v-model="image"
                      label="Imagen"
                      accept="image/*"
                      required
                      outlined
                      dense
                      class="rounded-pill"
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="subtitle"
                      label="Subtitulo del proyecto"
                      required
                      outlined
                      dense
                      class="rounded-pill"
                      :rules="nameRules"
                      :counter="20"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      v-model="description"
                      label="Descripcion"
                      required
                      outlined
                      dense
                      class="rounded-xl"
                      :rules="descriptionRules"
                      :counter="300"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="url"
                      label="URL"
                      required
                      outlined
                      dense
                      class="rounded-pill"
                      :rules="urlRules"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="endEditDialog">
                Cancelar
              </v-btn>
              <v-btn color="blue darken-1" text @click="submitForm">
                {{ edit ? "Guardar" : "Crear" }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="cancelDialog" max-width="500px" persistent>
          <v-card>
            <v-card-title class="headline">
              Seguro que desea eliminar el proyecto?
            </v-card-title>

            <v-card-text>
              Esta accion no se puede deshacer, el proyecto sera eliminado de manera
              permanente.
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="blue darken-1" text @click="cancelDialog = false">
                Cancelar
              </v-btn>

              <v-btn color="red darken-1" text @click="confirmedDelete">
                Borrar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Projects",
  components: {},
  data() {
    return {
      projects: [],

      dialog: false,
      edit: false,

      cancelDialog: false,

      title: "",
      subtitle: "",
      description: "",
      url: "",
      image: null,

      editedProject: null,
      deletedProject: null,

      nameRules: [
        (v) => !!v || "Este campo es obligatorio",
        (v) => v.length <= 20 || "Este campo tiene que ser menor a 20 caracteres",
      ],
      descriptionRules: [
        (v) => !!v || "Este campo es obligatorio",
        (v) => v.length <= 300 || "Este campo tiene que ser menor a 300 caracteres",
      ],
      urlRules: [(v) => !!v || "Este campo es obligatorio"],
    };
  },

  created() {
    this.getProjects();
  },

  methods: {
    getImage(name) {
      return process.env.VUE_APP_S3_URL + name;
    },

    async createProject() {
      const formData = new FormData();

      formData.append("title", this.title);
      formData.append("subtitle", this.subtitle);
      formData.append("description", this.description);
      formData.append("url", this.url);
      formData.append("file", this.image);

      const requestOptions = {
        method: "POST",
        body: formData,
      };

      await fetch(process.env.VUE_APP_API_URL + "projects/", requestOptions).then(
        (response) => {
          response.json();
        }
      );
      this.getProjects();
    },

    async getProjects() {
      await fetch(process.env.VUE_APP_API_URL + "projects/")
        .then((result) => result.json())
        .then((myJson) => {
          this.projects = myJson;
        });
    },

    async editProject(project) {
      const formData = new FormData();

      formData.append("title", this.title);
      formData.append("subtitle", this.subtitle);
      formData.append("description", this.description);
      formData.append("url", this.url);
      if (this.image) {
        formData.append("file", this.image);
      }

      const requestOptions = {
        method: "PUT",
        body: formData,
      };

      await fetch(
        process.env.VUE_APP_API_URL + `projects/${project._id}`,
        requestOptions
      ).then((response) => {
        response.json();
      });
      this.getProjects();
    },

    async deleteProject(project) {
      await fetch(process.env.VUE_APP_API_URL + `projects/${project._id}`, {
        method: "DELETE",
      });
      this.getProjects();
    },

    showEditDialog(project) {
      this.fillForm(project);
      this.editedProject = project;
      this.edit = true;
      this.dialog = true;
    },

    endEditDialog() {
      this.edit = false;
      this.dialog = false;
      this.title = "";
      this.subtitle = "";
      this.description = "";
      this.url = "";
      this.image = null;
      this.editedProject = null;
    },

    submitForm() {
      if (
        this.title.length < 1 ||
        this.subtitle.length < 1 ||
        this.description.length < 1 ||
        this.url.length < 1 ||
        this.title.length > 20 ||
        this.subtitle.length > 20 ||
        this.description.length > 300
      ) {
        return;
      }
      if (this.edit) {
        this.editProject(this.editedProject);
      } else {
        if (!this.image) {
          return;
        }
        this.createProject();
      }
      this.endEditDialog();
    },

    fillForm(project) {
      this.title = project.title;
      this.subtitle = project.subtitle;
      this.description = project.description;
      this.url = project.url;
    },

    showConfirmation(project) {
      this.deletedProject = project;
      this.cancelDialog = true;
    },

    confirmedDelete() {
      this.deleteProject(this.deletedProject);
      this.cancelDialog = false;
      this.deletedProject = null;
    },
  },
};
</script>
