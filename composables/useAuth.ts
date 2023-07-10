import { ClientResponseError, Record } from "pocketbase";

export default function () {
  const { $pb } = useNuxtApp();
  const toast = useToast();

  const data = ref<Record | null>(null);
  const pending = ref(false);

  const register = async (
    username: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    pending.value = true;

    if (username === "") {
      toast.add({
        color: "red",
        title: "Lỗi",
        description: "Tên tài khoản không được để trống.",
        icon: "i-fluent-error-circle-20-filled",
      });
    } else if (email === "") {
      toast.add({
        color: "red",
        title: "Lỗi",
        description: "Email không được để trống.",
        icon: "i-fluent-error-circle-20-filled",
      });
    } else if (password === "" || passwordConfirm === "") {
      toast.add({
        color: "red",
        title: "Lỗi",
        description: "Mật khẩu không được để trống.",
        icon: "i-fluent-error-circle-20-filled",
      });
    } else if (password !== passwordConfirm) {
      toast.add({
        color: "red",
        title: "Lỗi",
        description: "Xác nhận mật khẩu không đúng.",
        icon: "i-fluent-error-circle-20-filled",
      });
    } else {
      try {
        await $pb.collection("users").create({
          username,
          email,
          password,
          passwordConfirm,
        });

        await $pb.collection("users").requestVerification(email);

        const response = await $pb
          .collection("users")
          .authWithPassword(username, password);

        data.value = response.record;

        toast.add({
          color: "primary",
          title: "Đăng nhập thành công",
          description: "Đang chuyển hướng...",
          icon: "i-fluent-checkmark-circle-20-filled",
        });

        await navigateTo("/verification");
      } catch (err) {
        if (err instanceof ClientResponseError) {
          toast.add({
            color: "red",
            title: "Lỗi",
            description: err.message,
            icon: "i-fluent-error-circle-20-filled",
          });
        }
      }
    }

    pending.value = false;
  };

  const loginWithPassword = async (user: string, password: string) => {
    pending.value = true;

    if (user === "") {
      toast.add({
        color: "red",
        title: "Lỗi",
        description: "Email không được để trống.",
        icon: "i-fluent-error-circle-20-filled",
      });
    } else if (password === "") {
      toast.add({
        color: "red",
        title: "Lỗi",
        description: "Mật khẩu không được để trống.",
        icon: "i-fluent-error-circle-20-filled",
      });
    } else {
      try {
        const response = await $pb
          .collection("users")
          .authWithPassword(user, password);

        data.value = response.record;

        toast.add({
          color: "primary",
          title: "Đăng nhập thành công",
          description: "Đang chuyển hướng...",
          icon: "i-fluent-checkmark-circle-20-filled",
        });

        await navigateTo("/");
      } catch (err) {
        if (err instanceof ClientResponseError) {
          toast.add({
            color: "red",
            title: "Lỗi",
            description: err.message,
            icon: "i-fluent-error-circle-20-filled",
          });
        }
      }
    }

    pending.value = false;
  };

  const requestPasswordReset = async (email: string) => {
    pending.value = true;

    if (email === "") {
      toast.add({
        color: "red",
        title: "Lỗi",
        description: "Địa chỉ email không được để trống.",
        icon: "i-fluent-error-circle-20-filled",
      });
    } else {
      try {
        await $pb.collection("users").requestPasswordReset(email);

        toast.add({
          color: "primary",
          title: "Yêu cầu thành công",
          description: "Bạn vui lòng kiểm tra hộp thư...",
          icon: "i-fluent-checkmark-circle-20-filled",
        });

        await navigateTo("/login");
      } catch (err) {
        if (err instanceof ClientResponseError) {
          toast.add({
            color: "red",
            title: "Lỗi",
            description: err.message,
            icon: "i-fluent-error-circle-20-filled",
          });
        }
      }
    }

    pending.value = false;
  };

  return { data, pending, register, loginWithPassword, requestPasswordReset };
}
