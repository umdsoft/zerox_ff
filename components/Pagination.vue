<template>
  <div class="pagination_container flex  w-full ">
    <div class="flex items-center px-2 justify-end w-full ">
      <div class="pagination-indicator my-4 flex justify-between  items-center">
      
          <div class="dropdown  relative  mx-auto">
            <button
              @click="toogleDropDown"
              class="
                dropdown-toggle
                px-2
                py-2.5
                text-black
                font-medium
                text-xs
                leading-tight
                rounded
                shadow-md
                hover:text-blue-700 hover:shadow-lg
                focus:text-blue-700
                focus:shadow-lg
                focus:outline-none
                focus:ring-0
                active:bg-blue-800 active:shadow-lg active:text-white
                transition
                duration-150
                ease-in-out
                flex
                items-center
                whitespace-nowrap
              "
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <span class="hidden md:flex lg:flex">Har bir sahifadagi qatorlar : </span>{{ limit }}
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="caret-down"
                class="w-2 ml-2"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
              >
                <path
                  fill="currentColor"
                  d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
                ></path>
              </svg>
            </button>
            <ul
              ref="dropMenu"
              class="
                dropdown-menu
                min-w-max
                absolute
                bg-white
                text-base
                z-50
                py-2
                list-none
                w-full
                rounded-lg
                shadow-lg
                mt-1
                hidden
                m-0
                bg-clip-padding
                border-none
              "
              aria-labelledby="dropdownMenuButton1"
            >
              <li
                @click="setLimit(10)"
                class="
                  dropdown-item
                  cursor-pointer
                  text-center text-sm
                  px-4
                  font-normal
                  block
                  w-full
                  whitespace-nowrap
                  bg-transparent
                  text-gray-700
                  hover:bg-gray-100
                "
              >
                10
              </li>
              <li
                @click="setLimit(25)"
                class="
                  dropdown-item
                  cursor-pointer
                  text-center text-sm
                  px-4
                  font-normal
                  block
                  w-full
                  whitespace-nowrap
                  bg-transparent
                  text-gray-700
                  hover:bg-gray-100
                "
              >
                25
              </li>
              <li
                @click="setLimit(50)"
                class="
                  cursor-pointer
                  dropdown-item
                  text-center text-sm
                  px-4
                  font-normal
                  block
                  w-full
                  whitespace-nowrap
                  bg-transparent
                  text-gray-700
                  hover:bg-gray-100
                "
              >
                50
              </li>
              <li
                @click="setLimit(100)"
                class="
                  dropdown-item
                  cursor-pointer
                  text-center text-sm
        
                  px-4
                  font-normal
                  block
                  w-full
                  whitespace-nowrap
                  bg-transparent
                  text-gray-700
                  hover:bg-gray-100
                "
              >
                100
              </li>
            </ul>
    
        </div>
       
      </div>
      <div class="pagination-btns justify-center  items-center fle flex">
         <div class="ml-4 flex  items-center justify-between w-full">
          <span class="current text-xs  text-[#6E6893]">{{ currentPage + 1 }}  -</span>
          <span class="total text-xs">{{ calculateCount() }}  / <span class="text-xs" >{{ currentPage + 1 }}</span></span> 
        </div>
        <div class="prev  cursor-pointer" @click="prevPage">
          <svg
            class="h-5 ml-2 w-5 text-[#6E6893]"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <polyline points="15 6 9 12 15 18" />
          </svg>
        </div>
        <div class="next ml-6 cursor-pointer" @click="nextPage">
          <svg
            class="h-5 w-5 text-[#6E6893]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    currentPage: 0,
    limit: 10,
  }),
  mounted() {
    this.currentPage = this.page;
  },
  props: ["total", "perPage", "page"],
  methods: {
    toogleDropDown() {
      if (this.$refs.dropMenu.style.display === "block") {
        this.$refs.dropMenu.style.display = "none";
      } else {
        this.$refs.dropMenu.style.display = "block";
      }
    },
    setLimit(limit) {
      this.limit = limit;
      this.toogleDropDown();
      this.setPage({ page: this.currentPage, limit: this.limit });
    },

    setPage(page, limit) {
      this.$emit("page-change", page);
    },
    nextPage() {
       
      if (this.currentPage < Math.floor(this.total / this.limit) ) {
         this.currentPage++;
      this.setPage({ page: this.currentPage, limit: this.limit });
      }
     
    },
    prevPage() {
      if (this.currentPage < 1) return false;
      this.currentPage--;
      this.setPage({page:this.currentPage,limit:this.limit});
    },
    calculateCount() {

      return Math.ceil(this.total / this.perPage);
    },
  },
};
</script>

<style scoped>
</style>>

