<template>
    <div :class="{FilterMenuActive:ActivFilterMenu}" class="FilterMenu">
        <div class="FilterMenu__body">
            <div @click="isActivFilterMenu" class="DisconnectActivFilterMenuBtn">X</div>
            <form action="" class="filter_form">
                <div class="filter__inputs">
                    <label>Enter data on which the system will find the data you need</label>
                    <input placeholder="ID raqam" class="input" type="text">
                    <input placeholder="F.I.O"  class="input" type="text">
                    <input placeholder="Qarzni qaytarish sanasi" class="input" type="date">
                    <select class="input form-control" id="exampleFormControlSelect1">
                        <option>true</option>
                        <option>false</option>
                    </select>
                </div>
                <button type="button" class="filter_btn">Поиск</button>
            </form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'filterMenuKarz',
    props: {
        ActivFilterMenu: {
            default: false,
            required: false
        }, isActivFilterMenu: {
            default:function(){
                alert("что то пошло не так :(")
            }
        }
    }

}
</script>

<style>
.FilterMenu {
    box-shadow: 0px 0px 8px rgb(0 0 0 / 15%);
    background-color: white;
    transition-duration: .3s;
    height: 100vh;
    width: 25%;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    top: 0;
    right: -20%;
    z-index: 111;
}

.FilterMenuActive {
    right: 0px;
    opacity: 1;
    visibility: visible;
}

.FilterMenu__body {
    position: relative;
    padding: 35px;
}

.DisconnectActivFilterMenuBtn {
    color:red;
    font-size: 25px;
    text-align: end;
    font-weight: bold;
    cursor: pointer;
}

.filter__inputs {
    color: rgb(90, 90, 90);
    margin: 10px 0 0 0;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.filter_btn{
    transition-duration: .3s;
    margin: 20px 0 0 0;
    display: inline-block;
    padding: 7px 20px;
    border-radius: 5px;
    background: rgb(55, 144, 228);
    color:white;
}.filter_btn:hover{
    background: rgb(49, 128, 203);
}.filter__inputs .input {
    margin: 20px 0 0 0;
    padding: 10px 0 10px 10px;
    width: 100%;
    border-radius: 5px;
    border: 1px rgb(175, 175, 175) solid;
  }.filter__inputs .input:focus{
    outline: 2px  rgba(55, 144, 228, 0.43) solid;
  }
</style>