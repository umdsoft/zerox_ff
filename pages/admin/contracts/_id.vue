<template>
  <div>
  <div class="rounded-xl bg-white px-8 py-8 block" v-if="contract != null">
  <div>
    <span>{{contract.number}}-sonli qarz shartnomasi</span>
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

<style>
.dtype{
    display: flex;
}
</style>