import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import ScoutPage from "../components/ScoutPage.vue";
import ScoutMessageList from "../views/scoutListView.vue";
import RoleToggleView from "../views/RoleToggleView.vue";
import ScoutApprovalList from "../views/ScoutApprovalList.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "RoleSelection",
    component: RoleToggleView,  // ← トップページ（/）でロール選択画面を表示
  },
  {
    path: "/scout-messages",
    name: "ScoutMessageList",
    component: ScoutMessageList,
  },
  {
    path: "/approval",
    name: "ScoutApprovalList",
    component: ScoutApprovalList,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});