<template>
  <div class="absolute inset-0">
    <div class="flex h-full items-center justify-center overflow-y-scroll">
      <div
        class="w-full min-w-fit max-w-sm rounded-lg bg-zinc-200 p-6 dark:bg-zinc-700"
      >
        <h2 class="font-lexend mb-6 text-4xl font-bold">Đăng ký</h2>
        <form class="space-y-3">
          <div class="space-y-1">
            <label class="block" for="username">Tên tài khoản</label>
            <input
              id="username"
              class="focus:ring-primary w-full rounded-xl border-none bg-zinc-300 transition-all invalid:ring-2 invalid:ring-red-400 focus:bg-zinc-100 focus:ring-2 dark:bg-zinc-600 focus:dark:bg-zinc-700"
              type="text"
              placeholder="kikuri"
            />
          </div>
          <div class="space-y-1">
            <label class="block" for="email">Email</label>
            <input
              id="email"
              class="focus:ring-primary w-full rounded-xl border-none bg-zinc-300 transition-all invalid:ring-2 invalid:ring-red-400 focus:bg-zinc-100 focus:ring-2 dark:bg-zinc-600 focus:dark:bg-zinc-700"
              type="email"
              placeholder="konnichiwa@glhf.vn"
            />
          </div>
          <div class="space-y-1">
            <label class="block" for="password">Mật khẩu</label>
            <input
              id="password"
              class="focus:ring-primary w-full rounded-xl border-none bg-zinc-300 transition-all focus:bg-zinc-100 focus:ring-2 dark:bg-zinc-600 focus:dark:bg-zinc-700"
              type="password"
              placeholder="dotdotdot"
            />
          </div>
          <AppButton class="w-full" intent="primary">Đăng ký</AppButton>
          <div class="text-center text-zinc-600 dark:text-zinc-400">
            <NuxtLink
              class="decoration-primary decoration-2 hover:underline"
              to="/login"
              >Đăng nhập</NuxtLink
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>