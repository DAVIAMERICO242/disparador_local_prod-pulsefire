module.exports = {
  apps: [
    {
      name: "portfolio",
      script: "npm",
      args: "run dev",
      error_file: "./pm2-error.log",
      out_file: "./pm2-out.log"
    }
  ]
};
