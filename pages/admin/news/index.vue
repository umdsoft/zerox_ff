<template>
    <div>
        <div @click="isActiveNewsform" :class="{activeDarkArea:NewsformActive}" class="News__darkArea"></div>
        <div class="box-all">
            <button @click.prevent="isActiveNewsform" class="table__btnAdd"><span>+</span> Add</button>
            <div :class="{NewsformActive:NewsformActive}" class="News__Add">
                <form class="News__form">
                    <select class="input form-control" id="exampleFormControlSelect1">
                        <option v-model="Til">uz</option>
                        <option v-model="Til">ru</option>
                    </select>
                    <input v-model="Mavzu" placeholder="Mavzu" class="input" type="text">
                    <textarea v-model="Yangilik" placeholder="Yangilik" class="input" name="" id="" cols="30"
                        rows="10"></textarea>
                    <div class="News__btns">
                        <button @click.prevent="isActiveNewsform" class="News__Btn">Delete</button>
                        <button class="News__Btn">add</button>
                    </div>
                </form>
            </div>
            <div class="table">
                <table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Mavzu</th>
                            <th>Yangilik</th>
                            <th>til</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>1</th>
                            <th>Mavzu Lorem</th>
                            <th>Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet
                                consectetur adipisicing elit Eius qui deserunt cupiditate alias minus animi,Lorem ipsum
                                dolor sit amet consectetur adipisicing elit. Eius qui deserunt cupiditate alias minus
                                animi,
                                Lorem ipsum dolor sit amet consectetur adipisicing elit.Lorem ipsum dolor sit amet
                                consectetur adipisicing</th>
                            <th>ru</th>
                            <th class="table__btns"><button class="table__btn">Edit</button><button class="table__btn">delete</button></th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="pagination"><!----></div>
        </div>
    </div>
</template>
<script>
export default {
    layout: "admin",
    name: "AddNews",
    data() {
        return {
            NewsformActive: false,
            Mavzu: '',
            Yangilik: '',
            Til: ''
        }
    }, methods: {
        isActiveNewsform() {
            this.NewsformActive = !this.NewsformActive
            this.Mavzu = ''
            this.Yangilik = ''
            this.Til = ''
        }
    }
}
</script>

<style>
* {
    box-sizing: border-box;
}

.table {
    margin: 20px 0 0 0;
    position: relative;
}

th {
    border: 1px solid #eff2f7;
    text-align: left;
    padding: 12px;
    font-size: 14px;
    color: #495057;
}

th:nth-child(3) {
    max-width: 700px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
}

.table__btns {
    width: max-content !important;
    display: flex;
}

.table__btnAdd,
.table__btn {
    display: inline-block;
    background: rgb(49, 206, 67);
    margin: 0 0 0 15px;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
}

.table__btn:nth-child(2) {
    background: rgb(206, 49, 49);
}

.table__btnAdd {
    padding: 5px 18px;
    display: block;
    width: max-content;
    margin: auto 0px auto auto;
}

.table__btnAdd span {
    font-size: 22px;
}

.News__Add {
    transition-duration: .3s;
    position: absolute;
    border-radius: 5px;
    opacity: 0;
    visibility: hidden;
    top: -20px;
    left: 25%;
    background-color: white;
    z-index: 111;
    box-shadow: 0px 0px 8px rgb(0 0 0 / 15%);
    width: 40%;
    padding: 20px;
}

.News__form {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

textarea {
    max-height: 350px;
}

.News__Btn {
    display: inline-block;
    width: max-content;
    background: rgb(49, 206, 67);
    margin: 15px 0 0 0;
    padding: 5px 10px;
    border-radius: 5px;
    color: white;
}

.News__Btn:nth-child(1) {
    background: rgb(206, 49, 49);
}

.NewsformActive {
    top: 5px;
    opacity: 1;
    visibility: visible;
}

.News__darkArea {
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 101;
    background: rgba(0, 0, 0, 0.151);
}.activeDarkArea{
    opacity: 1;
    visibility: visible;
}.input {
    margin: 20px 0 0 0;
    padding: 10px 0 10px 10px;
    width: 100%;
    border-radius: 5px;
    border: 1px rgb(175, 175, 175) solid;
  }.input:focus{
    outline: 2px  rgba(55, 144, 228, 0.43) solid;
  }
</style>