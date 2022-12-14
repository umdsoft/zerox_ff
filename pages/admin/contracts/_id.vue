<template>
  <div>
  <div class="rounded-xl bg-white px-8 py-8 block" v-if="contract != null">
  <div class="flex  justify-between w-100 h-16">
    <span>{{contract.number}}-sonli qarz shartnomasi</span>
    <div class="bts">
        <button class="btn1  bt px-3 py-1 flex">    <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24.9999 14.2858V12.5001H19.6427V21.4286H21.4284V17.8572H24.107V16.0715H21.4284V14.2858H24.9999ZM15.1784 21.4286H11.607V12.5001H15.1784C15.8886 12.5008 16.5695 12.7833 17.0717 13.2854C17.5739 13.7876 17.8563 14.4685 17.857 15.1787V18.75C17.8563 19.4602 17.5739 20.1411 17.0717 20.6433C16.5695 21.1454 15.8886 21.4279 15.1784 21.4286ZM13.3927 19.6429H15.1784C15.4152 19.6427 15.6421 19.5485 15.8095 19.3811C15.9769 19.2137 16.0711 18.9868 16.0713 18.75V15.1787C16.0711 14.9419 15.9769 14.715 15.8095 14.5476C15.6421 14.3802 15.4152 14.2861 15.1784 14.2858H13.3927V19.6429ZM8.03557 12.5001H3.57129V21.4286H5.357V18.75H8.03557C8.50896 18.7493 8.96275 18.561 9.29748 18.2262C9.63222 17.8915 9.82058 17.4377 9.82129 16.9644V14.2858C9.82082 13.8124 9.63253 13.3584 9.29774 13.0237C8.96296 12.6889 8.50903 12.5006 8.03557 12.5001V12.5001ZM5.357 16.9644V14.2858H8.03557L8.03647 16.9644H5.357Z"
              fill="white"
            />
            <path
              d="M17.8571 10.7145V7.14307C17.8603 7.02573 17.838 6.9091 17.7917 6.80121C17.7455 6.69332 17.6764 6.59673 17.5893 6.51808L11.3393 0.268157C11.2607 0.180966 11.1641 0.111865 11.0562 0.0656216C10.9483 0.0193781 10.8316 -0.00290695 10.7143 0.000303604H1.78571C1.31255 0.00171674 0.859165 0.190306 0.524585 0.524882C0.190004 0.859458 0.00141315 1.31284 0 1.786V23.2143C0 23.6879 0.188137 24.1421 0.523024 24.477C0.85791 24.8119 1.31211 25 1.78571 25H16.0714V23.2143H1.78571V1.786H8.92857V7.14307C8.92998 7.61624 9.11858 8.06961 9.45316 8.40419C9.78774 8.73877 10.2411 8.92735 10.7143 8.92877H16.0714V10.7145H17.8571ZM10.7143 7.14307V2.14313L15.7143 7.14307H10.7143Z"
              fill="white"
            />
          </svg> Qarz shartnomasi va ilova hujjatlarni yuklab olish</button> <br>
    </div>
  </div>
<br>
    <div>
        <p><b>Qarz beruvchi (Debitor):</b> {{contract.debitor_name}}</p>
            <p><b>Qarz oluvchi (Kreditor):</b> {{contract.creditor_name}}</p>
            <p><b>Qarz miqdori:</b> {{contract.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} {{contract.currency}}</p>
            <p><b>Qarz rasmiylashtirilgan vaqt:</b> {{dateFormat(contract.created_at)}} yil</p>
    </div>

    <div class="table" v-if="acts!=null">
       <table>
         <thead>
            <tr>
                <th>№</th>
                <th>Hujjat turi</th>
                <th>Yaratilgan sana</th>
                <th>Qaytarilgan miqdor</th>
                <th>Voz kechilgan miqdor</th>
                <th>Qoldiq qarz miqdori</th>
                <th>Qarzni qaytarish sanasi</th>
                <th>Holat</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item,index) in acts" :key="item.id">
                <td>{{index+1}}</td>
                <td>
                    <p v-if="item.type == 0">Qarz mablag‘i olinganligi to‘g‘risida dalolatnoma</p>
                    <p  v-if="item.type == 1">Qarz qisman qaytarilganligi to‘g‘risida dalolatnoma</p>
                    <p  v-if="item.type == 2">Qarz to‘liq qaytarilganligi to‘g‘risida dalolatnoma</p>
                    <p v-if="item.type == 3">Qarz muddati uzaytirilganligi to‘g‘risida dalolatnoma</p>
                    <p v-if="item.type == 4">Qarzdan voz kechilganligi to‘g‘risida dalolatnoma</p>
                    <p v-if="item.type == 6">Qarz muddati uzaytirilganligi to‘g‘risida dalolatnoma</p>
                </td>
                <td style="text-align:center;">{{dateFormat(item.created_at)}} yil</td>                
                <td style="text-align:center;">{{item.residual_amount == 0 ? '-' : item.residual_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} <span v-if="item.residual_amount != 0">{{contract.currency}}</span></td>
                <td style="text-align:center;">{{item.vos_summa == 0 ? '-' : item.vos_summa.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} <span v-if="item.vos_summa != 0">{{contract.currency}}</span></td>
                <td style="text-align:center;">{{item.refundable_amount == 0 ? '-' : item.refundable_amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}} <span v-if="item.refundable_amount != 0">{{contract.currency}}</span></td>
                <td style="text-align:center;">{{dateFormat(item.end_date)}} yil</td>
                <td style="text-align:center;"> 
                    <span class="badge badge-success" v-if="item.status == 1">Tasdiqlangan</span>
                    <span class="badge badge-danger" v-if="item.status == 2">Rad qilingan</span>
                    <span class="badge badge-secondary" v-if="item.status == 0">Jarayonda</span>
                </td>
            </tr>
             
        </tbody>
       </table>
    </div>
  </div>
  </div>
</template>

<script>
import dateformat from "dateformat";
export default {
        // middleware: "checkRole",
    layout:'admin',
    mounted() {
        this.getContractById(this.$route.params.id)
    },  
    data:() => ({
        contract:null,
        acts: null
    }),
    methods:{

        dateFormat(date) {
            let date1 = dateformat(date, "isoDate");
            date1 = date1.split("-").reverse();
            date1 = date1.join(".");
            return date1;
        },
      async  getContractById (id) {
            try {
                const response = await this.$axios.get(`/contract/admin/contract/${id}`)
                if(response.status === 200) {
                    this.contract = response.data.contract
                    this.acts = response.data.acts
                    // console.log(this.contract)
                }
            }
            catch(e) {
                console.log(e)
            }
        }
    }


}
</script>

<style lang="scss">
bts{
    height: 70px
}
.bt {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 0px auto;
    color: #fff;
    background: #3d95ff;
    border-radius: 5px;
    
    svg{
        padding-right: 10px;
    }
    &:hover{
        background: #368df7;
    }
  }

.dtype{
    display: flex;
}
</style>