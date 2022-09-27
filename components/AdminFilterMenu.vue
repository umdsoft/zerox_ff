<template>
    <div :class="{FilterMenuActive:ActivFilterMenu}" class="FilterMenu">
        <div class="FilterMenu__body">
            <div @click="isActivFilterMenu" class="DisconnectActivFilterMenuBtn">X</div>
            <form action="" class="filter_form">
                <div class="filter__inputs">
                    <input class="input" type="text">
                    <input class="input" type="text">
                    <select class="input form-control" id="exampleFormControlSelect1">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                    <input class="input" type="text">
                    <input class="input" type="text">
                    <input class="input" type="text">
                </div>
                <button type="button" class="filter_btn">Поиск</button>
            </form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'filterMenu',
    props: {
        ActivFilterMenu: {
            default: false,
            required: false
        }, isActivFilterMenu: {
            default: () => {
                alert("что то пошло не так")
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
    padding: 30px;
}

.DisconnectActivFilterMenuBtn {
    color: #38445a;
    font-size: 25px;
    text-align: end;
    font-weight: bold;
    cursor: pointer;
}

.filter__inputs {
    margin: 20px 0 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.filter__inputs .input {
    margin: 20px 0 0 0;
    width: 100%;
    border: 1px #38445a solid;
}.filter_btn{
    transition-duration: .3s;
    margin: 20px 0 0 0;
    display: inline-block;
    padding: 7px 20px;
    border-radius: 5px;
    background: rgb(55, 144, 228);
    color:white;
}.filter_btn:hover{
    background: rgb(49, 128, 203);
}
</style>