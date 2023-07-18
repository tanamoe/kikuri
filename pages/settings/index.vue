<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const { isAuthenticated } = useUserStore();

if (isAuthenticated) navigateTo("/settings/profile");
else navigateTo("/settings/interface");

definePageMeta({
  layout: "setting",
});
</script>
