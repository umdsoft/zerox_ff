export default function({ $axios, store, redirect }) {
    // $axios.onRequest((config) => {
    //     store.commit("ACTIVE_LOADING");
    // });
    // $axios.onResponse((res) => {
    //     store.commit("FALSE_LOADING");
    // });
    $axios.onError((res) => {
        store.commit("FALSE_LOADING");
    });
}