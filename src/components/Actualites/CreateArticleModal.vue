<script></script>

  <template>
  <transition name="fade">
    <div v-if="modelValue && event" class="modal-overlay" @click.self="closeModal">
      <transition name="slide-up">
        <div class="modal-dialogue bg-dark text-white" v-if="modelValue">
          <div class="modal-content">

            <!-- ===============================
                🔸 HEADER DE LA MODALE
                =============================== -->
             <div class="modal-header">
        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

            <!-- ===============================
                🔸 CORPS DE LA MODALE
                =============================== -->
            <div class="modal-body bg-light text-dark p-3 mb-3">


              <hr class="my-3" />
              <h6>Description détaillée :</h6>
              <p>{{ article.titre || 'Aucune description disponible.' }}</p>
            </div>

            <!-- ===============================
                🔸 PIED DE PAGE (FOOTER)
                =============================== -->
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Fermer</button>
            </div>

          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>
