<template>
  <div>
    <div class="navbar">
      <div class="d-flex ml-auto">
        <router-link class="btn rounded-pill" to="/"
          ><v-icon color="white">mdi-logout</v-icon> cerrar sesión
        </router-link>
      </div>
    </div>
    <div class="navbar">
      <div class="d-flex mx-auto">
        <router-link class="btn rounded-pill active" to="/">
          Proyectos
        </router-link>
        <router-link class="btn rounded-pill" to="/"> Experiencia </router-link>
        <router-link class="btn rounded-pill" to="/"> Habilidades </router-link>
        <router-link class="btn rounded-pill" to="/"> Contacto </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.btn {
  color: white;
  font-weight: bold;
}

.active {
  background: #fe7a72;
  color: black;
  font-weight: bold;
}
</style>
