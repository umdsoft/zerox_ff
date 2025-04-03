export default function ({ app }) {
  let socketSent = false;

  if (process.client) {
    const interval = setInterval(() => {
      const $auth = app.$auth;

      if (
        !socketSent &&
        $auth &&
        $auth.loggedIn &&
        $auth.user &&
        $auth.user.id
      ) {
        const socket = app.$nuxtSocket({
          name: "home",
          channel: "/",
          secure: true,
          default: false,
          query: {
            uid: $auth.user.id,
          },
        });

        socket.emit("me", { userId: $auth.user.id }, () => {
          console.log("✅ socket.emit('me') => yuborildi!");
        });

        socketSent = true;
        clearInterval(interval);
      }
    }, 500);
  }
}
