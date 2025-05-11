// store/notification.js
export const namespaced = true;

export const state = () => ({
  notifications: [],
  balance: 0,
});

export const mutations = {
  setNotifications(state, data) {
    state.notifications = data;
  },
  setBalance(state, amount) {
    state.balance = amount;
  },
};

export const actions = {
  registerSocketListeners({ commit }, { socket, userId }) {
    socket.off("recive_notification");

    socket.on("recive_notification", (data) => {
      const filtered = data.notification.filter((n) => n.reciver === userId);
      commit("setNotifications", filtered); // 👈 bu mutatsiyalar endi local bo'ladi
      commit("setBalance", data.amount?.balance || 0);
    });

    socket.emit("register", { id: userId });
    socket.emit("send_notification", { id: userId });
  },
};
