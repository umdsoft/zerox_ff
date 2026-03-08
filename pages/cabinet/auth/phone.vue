<template>
  <div class="phone auth bg-white pt-4 px-4">
    <BackButton />
    <div v-if="step == 1">
      <div class="flex justify-center items-center" style="margin-top:5rem">
        <div style="width:26.6rem;">
          <h2 class="font-bold text-2xl">{{ $t('a1.a32') }}</h2>
          <p class="text-gray-500  my-5">{{ $t('a1.a33') }}</p>
          <hr class="hr_line my-5">
          <p class="text-t_secondary mb-2"> {{ $t('user.tel') }}</p>
          <input type="text" @input="removeSpace" class="input " :placeholder="$t('debt_list.a51')"
            v-mask="'+998 ## ### ## ##'">
          <button @click="stepGo" class="bg-t_primary hover:bg-blue-700 text-white mt-6 py-4  px-4 rounded w-full">{{
            $t('debt_list.a20') }}</button>

        </div>

      </div>
    </div>

    <div v-if="step == 2">
      <div class="flex justify-center items-center" style="margin-top:5rem">
        <div style="width:26.6rem;">
          <h2 class="font-bold text-2xl">{{ $t('a1.a32') }}</h2>
          <p class="text-gray-500  my-5">{{ $t('debt_list.a54') }}</p>
          <hr class="hr_line my-5">
          <p class="text-t_secondary mb-2">{{ $t('placeholder.a60') }}</p>
          <input type="text" class="input">
          <button class="bg-t_primary hover:bg-blue-700 text-white mt-6 py-4  px-4 rounded w-full">{{
            $t('process.accept') }}</button>
        </div>

      </div>
    </div>


  </div>
</template>

<script>
import BackButton from '@/components/BackButton.vue';

export default {
  components: { BackButton },
  middleware: 'auth',
  data: () => ({
    step: 1
  }),
  methods: {
    removeSpace(e) {
      this.login.phone = e.trim()
    },
    stepGo() {
      this.step = this.step + 1
    }

  }
};
</script>

<style lang="scss" scoped>
.auth {
  padding-bottom: 8rem;
}

.hr_line {
  border: none;
  height: 0.2px;
  /* Set the hr color */
  color: #f5f5f5;
  /* old IE */
  background-color: #f5f5f5;
  /* Modern Browsers */
}

.input {
  border: 1px solid #1565d8;
  width: 100%;
  height: 50px;
  text-indent: 10px;
  border-radius: 5px;
}

input:focus {
  outline: none;
  box-shadow: 0px 4px 10px 3px rgba(0, 0, 0, 0.11);
  border: 1px solid #1565d8;
}
</style>
