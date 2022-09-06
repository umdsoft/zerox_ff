export const state = () => ({
    isLoading: false,
    isOpen: false,
    actType: '',
    contractData: {},
    end_date: null,
    isActModalOpen: false,
    links: [],
    myInfo: [],
});

export const mutations = {

    SHOW_ACT_MODAL(state, payload) {
        state.actType = payload.type
        state.contractData = payload.contract
        state.contractData.act = payload.act
        state.end_date = payload.time
        state.isActModalOpen = true
    },
 
    HIDE_ACT_MODAL(state, data) {
        state.isActModalOpen = false,
            state.contractData = {}
    },

    SET_MYINFO(state, data) {
        state.myInfo = data;
    },

    ACTIVE_LOADING(state) {
        state.isLoading = true;
    },
    FALSE_LOADING(state) {
        state.isLoading = false;
    },
    Media_Menu_Open(state) {
        state.isOpen = true;
    },
    Media_Menu_Close(state) {
        state.isOpen = false;
    },
    changeBreadCrumb(state, data) {
        state.links = data;
    },
};