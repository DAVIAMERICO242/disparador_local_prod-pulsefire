// vite.config.js
import { defineConfig } from "file:///C:/Users/INTELIGENCIA/Desktop/disparador%20local%20e%20prod/disparador_prod/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/INTELIGENCIA/Desktop/disparador%20local%20e%20prod/disparador_prod/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dotenv from "file:///C:/Users/INTELIGENCIA/Desktop/disparador%20local%20e%20prod/disparador_prod/frontend/node_modules/dotenv/lib/main.js";
dotenv.config();
var vite_config_default = defineConfig({
  plugins: [react()],
  preview: {
    port: process.env.VITE_FRONTEND_PORT
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxJTlRFTElHRU5DSUFcXFxcRGVza3RvcFxcXFxkaXNwYXJhZG9yIGxvY2FsIGUgcHJvZFxcXFxkaXNwYXJhZG9yX3Byb2RcXFxcZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXElOVEVMSUdFTkNJQVxcXFxEZXNrdG9wXFxcXGRpc3BhcmFkb3IgbG9jYWwgZSBwcm9kXFxcXGRpc3BhcmFkb3JfcHJvZFxcXFxmcm9udGVuZFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvSU5URUxJR0VOQ0lBL0Rlc2t0b3AvZGlzcGFyYWRvciUyMGxvY2FsJTIwZSUyMHByb2QvZGlzcGFyYWRvcl9wcm9kL2Zyb250ZW5kL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgZG90ZW52IGZyb20gJ2RvdGVudidcclxuZG90ZW52LmNvbmZpZygpXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSwgIFxyXG4gIHByZXZpZXc6IHtcclxuICAgIHBvcnQ6IHByb2Nlc3MuZW52LlZJVEVfRlJPTlRFTkRfUE9SVCxcclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBZ2IsU0FBUyxvQkFBb0I7QUFDN2MsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sWUFBWTtBQUNuQixPQUFPLE9BQU87QUFHZCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsTUFBTSxRQUFRLElBQUk7QUFBQSxFQUNwQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
