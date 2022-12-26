<template>
  <div class="bg-white rounded-xl flex flex-col px-4 py-4">
    <div
      @click="$router.go(-1)"
      class="my-2 mx-6 hidden lg:inline-flex  items-center"
      style="cursor: pointer"
    >
      <svg
        class="h-5 w-5 text-blue-500"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" />
        <polyline points="15 6 9 12 15 18" />
      </svg>
      <p class="text-blue-500">{{$t('back')}}</p>
    </div>

    <div v-if="step == 1">
      <div
        class="flex items-center place-self-center"
        style="margin-top: 50px;justify-content: center; margin-bottom: 100px"
      >
        <input

          v-model="id"
          type="text"
          class="bt input p-5  bg-white text-gray text-lg rounded"
          :placeholder="$t('placeholder.id')"
        />

        <input

          v-model="stir"
          type="text"
          class="bt input p-5 bg-white text-gray text-lg rounded"
        :placeholder="$t('placeholder.stir')"
        />

        <button
          class="
            bt
            btn
            p-5
            mb-8
            bg-t_primary
            text-white
            rounded
            text-center text-base
          "
          @click="search"
        >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M19.9399 18.5624L13.4474 12.0699C14.4549 10.7675 14.9999 9.17496 14.9999 7.49997C14.9999 5.49498 14.2174 3.61498 12.8024 2.19749C11.3874 0.779996 9.50246 0 7.49997 0C5.49748 0 3.61248 0.782496 2.19749 2.19749C0.779996 3.61248 0 5.49498 0 7.49997C0 9.50246 0.782496 11.3874 2.19749 12.8024C3.61248 14.2199 5.49498 14.9999 7.49997 14.9999C9.17496 14.9999 10.765 14.4549 12.0674 13.4499L18.5599 19.9399C18.579 19.959 18.6016 19.9741 18.6264 19.9844C18.6513 19.9947 18.678 20 18.7049 20C18.7318 20 18.7585 19.9947 18.7834 19.9844C18.8083 19.9741 18.8309 19.959 18.8499 19.9399L19.9399 18.8524C19.959 18.8334 19.9741 18.8108 19.9844 18.7859C19.9947 18.761 20 18.7343 20 18.7074C20 18.6805 19.9947 18.6538 19.9844 18.6289C19.9741 18.6041 19.959 18.5815 19.9399 18.5624ZM11.46 11.46C10.4 12.5174 8.99496 13.0999 7.49997 13.0999C6.00497 13.0999 4.59998 12.5174 3.53998 11.46C2.48249 10.4 1.89999 8.99496 1.89999 7.49997C1.89999 6.00497 2.48249 4.59748 3.53998 3.53998C4.59998 2.48249 6.00497 1.89999 7.49997 1.89999C8.99496 1.89999 10.4025 2.47999 11.46 3.53998C12.5174 4.59998 13.0999 6.00497 13.0999 7.49997C13.0999 8.99496 12.5174 10.4025 11.46 11.46Z"
              fill="white" />
          </svg>
          {{$t('searching')}}
        </button>
        <div v-if="user" class="btm flex align-center justify-evenly mb-12">
          <div class="left text-t_primary">
            <h2>{{$t('transfer.company')}} :</h2>
            <h2>{{$t('transfer.reg_system')}}</h2>
            <h2>{{$t('transfer.id')}}:</h2>
          </div>
          <div class="center ml-8 -left-100">
            <h2>
              {{ user.company}}
            </h2>
            <h2>{{ dateFormat(user.created_at) }}</h2>
            <h2>{{ user.uid }}</h2>
          </div>
          <div class="flex flex-col">
                 <button
            @click="seeInfo"
            class="
              bta
              p-2
              mb-5
              ml-8
              bg-t_primary
              text-white
              rounded
              text-center text-base
            "
          >
            {{$t('process.see1')}}
          </button>
          <nuxt-link to="/give-money"
            ><button
              class="
                bta
                px-4
                py-2
                ml-8
                bg-green-400
                text-white
                rounded
                text-center text-base
              "
            >
              {{$t('process.see2')}}
            </button>
          </nuxt-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import dateformat from "dateformat";
export default {
   middleware:'auth',
  data: () => ({
    step: 1,
    birthday: "",
    id:"",
    stir: "",
    type: null,
    user: null,
  }),
  methods: {
  dateFormat(date) {
      let date1 = dateformat(date, "isoDate");
      date1 = date1.split("-").reverse();
      date1 = date1.join(".");
      return date1;
    },

    async search() {
      try {
        console.log(this.birthday);
        const response = await this.$axios.post("user/search", {
          id: this.id,
          stir:this.stir,
          type: 2,
        });

        console.log(response);
        if (response.status == 200) {
          this.user = response.data.user;
          this.$auth.user2 = this.user;
        }
      } catch (e) {
        this.$toast.error("Foydalanuvchi topilmadi");
      }
    },
    seeInfo() {
      this.$auth.user2 = this.user;
      console.log(this.user)
      this.$router.push("/search/debitor/result");
    },
  },
};
</script>


<style lang="scss" scoped>
.my-picker-class {
  border: none !important;
  border-bottom: 1px solid #f26f31 !important;

  &:focus {
    outline: none !important;
  }
}

.test {
  input {
    border: none !important;
  }
}

.date {
  outline: none;
}

table.iksweb {
  text-decoration: none;
  border-collapse: collapse;
  width: 50%;
}

table.iksweb th {
  font-weight: normal;
  font-size: 14px;
  color: #ffffff;
  background-color: #000000;
}

table.iksweb td {
  font-size: 15px;
  color: #000000;
}

table.iksweb td,
table.iksweb th {
  padding: 6px 5px;
  line-height: 13px;
  vertical-align: middle;
}

.bta {
  width: 306px;
  outline: none;
  box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.06);
}

.input {
  margin: 0 15px 0 0;
  width: 228px;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #8692A6;
  box-shadow: 0px 5px 14px rgba(0, 0, 0, 0.06);
  border-radius: 5px;
}.btn{
  margin: 0 0 0 15px;
  width: 131px;
height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
background: #D9D9D9;
border-radius: 5px;
}
</style>
