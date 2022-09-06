<template>
  <div class="bg-white rounded pb-12">
    <h2 class="service">Ko'p so'raladigan savollar</h2>
    <div class="container11">
      <button class="question btn">
        <h3>Ko'p so'raladigan savollar</h3>
        <span
          ><svg
            width="21"
            height="12"
            viewBox="0 0 21 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 2L10.5 10.5L2 2"
              stroke="white"
              stroke-width="2.44142"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>
      <div class="answercont">
        <div class="answer">
          Click the link in the verification email from verify@codepen.io (be
          sure to check your spam folder or other email tabs if it's not in your
          inbox). Or, send an email with the subject "Verify" to
          verify@codepen.io from the email address you use for your CodePen
          account.<br /><br />

          <a
            href="https://blog.codepen.io/documentation/features/email-verification/#how-do-i-verify-my-email-2"
            >How to Verify Email Docs</a
          >
        </div>
      </div>
    </div>
    <div class="container11">
      <button class="question btn">
        <h3>Ko'p so'raladigan savollar</h3>
        <span
          ><svg
            width="21"
            height="12"
            viewBox="0 0 21 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 2L10.5 10.5L2 2"
              stroke="white"
              stroke-width="2.44142"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>
      <div class="answercont">
        <div class="answer">
          Click the link in the verification email from verify@codepen.io (be
          sure to check your spam folder or other email tabs if it's not in your
          inbox). Or, send an email with the subject "Verify" to
          verify@codepen.io from the email address you use for your CodePen
          account.<br /><br />

          <a
            href="https://blog.codepen.io/documentation/features/email-verification/#how-do-i-verify-my-email-2"
            >How to Verify Email Docs</a
          >
        </div>
      </div>
    </div>
    <div class="container11">
      <button class="question btn">
        <h3>Ko'p so'raladigan savollar</h3>
        <span
          ><svg
            width="21"
            height="12"
            viewBox="0 0 21 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 2L10.5 10.5L2 2"
              stroke="white"
              stroke-width="2.44142"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </button>
      <div class="answercont">
        <div class="answer">
          Click the link in the verification email from verify@codepen.io (be
          sure to check your spam folder or other email tabs if it's not in your
          inbox). Or, send an email with the subject "Verify" to
          verify@codepen.io from the email address you use for your CodePen
          account.<br /><br />

          <a
            href="https://blog.codepen.io/documentation/features/email-verification/#how-do-i-verify-my-email-2"
            >How to Verify Email Docs</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
   middleware:'auth',
  data() {
    return {
      message: "Hello Vue!",
    };
  },
  mounted() {
    this.accordion();
  },
  methods: {
    accordion() {
      let question = document.querySelectorAll(".question");

      question.forEach((question) => {
        question.addEventListener("click", (event) => {
          const active = document.querySelector(".question.active");
          if (active && active !== question) {
            active.classList.toggle("active");
            active.nextElementSibling.style.maxHeight = 0;
          }
          question.classList.toggle("active");
          const answer = question.nextElementSibling;
          if (question.classList.contains("active")) {
            answer.style.maxHeight = answer.scrollHeight + "px";
          } else {
            answer.style.maxHeight = 0;
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.question::before {
  content: "\203A";
  font-size: 2.2rem;
  position: absolute;
  left: 20px;
  transition: 0.2s;
}

.question.active::before {
  transform: rotate(90deg);
}
.question.active {
  span {
    svg {
      transition: 0.2s;
      transform: rotate(180deg);
    }
  }
}

.answercont {
  max-height: 0;
  overflow: hidden;
  transition: 0.3s;
}

.answer {
  padding: 0 20px 20px;
  line-height: 1.5rem;
}
.service {
  text-align: center;
  padding: 45px;
  font-weight: 700;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  background-color: rgb(76, 144, 210);
  color: white;
  padding: 10px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
  width: 300px;
  span {
    svg {
      transition: 0.2s;
    }
  }
}

.call {
  text-align: center;
  color: rgb(76, 144, 210);
}
</style>
