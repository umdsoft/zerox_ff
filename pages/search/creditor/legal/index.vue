<template>
  <div class="bg-white rounded-xl flex flex-col px-4 py-4">
    <div @click="$router.go(-1)" class="my-2 mx-6 hidden lg:inline-flex  items-center" style="cursor:pointer">
      <svg class="h-5 w-5 text-blue-500" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
        stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" />
        <polyline points="15 6 9 12 15 18" />
      </svg>
      <p class="text-blue-500 ">{{$t('back')}}</p>
    </div>


    <div v-if="step == 1">
      <div class="flex items-center place-self-center"
        style="margin-top: 50px;justify-content: center; margin-bottom: 100px">
        <input v-model="id" type="text" class="bt input p-5  bg-white text-gray text-lg rounded"
          placeholder="ID raqamni kiriting" />

        <input v-model="stir" type="text" class="bt input p-5 bg-white text-gray text-lg rounded"
          placeholder="STIR ni kiriting" />

        <button class="
            bt
            btn
            p-5
            mb-8
            bg-t_primary
            text-white
            rounded
            text-center text-base
          " @click="search">
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
            <button @click="seeInfo" class="
              bta
              p-2
              mb-5
              ml-8
              bg-t_primary
              text-white
              rounded
              text-center text-base
            ">
              {{$t('process.see1')}}
            </button>
            <nuxt-link to="/give-money"><button class="
                bta
                px-4
                py-2
                ml-8
                bg-green-400
                text-white
                rounded
                text-center text-base
              ">
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
  middleware: 'auth',
  data: () => ({
    step: 1,
    stir: "",
    id: null,
    type: null,
    user: null
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
          stir: this.stir,
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
      this.$auth.user2 = this.user
      this.$router.push('/search/creditor/result')
    }
  }
}
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
