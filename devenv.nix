{ pkgs, config, ... }:

{
  # ── Languages ──────────────────────────────────────────────
  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    npm.enable = true;
    npm.install.enable = true;
  };
  languages.typescript.enable = true;

  # ── Packages ───────────────────────────────────────────────
  packages = with pkgs; [
    git
    jq
    curl
    fd
    ripgrep
  ];

  # ── Environment ────────────────────────────────────────────
  env.NODE_ENV = "development";

  dotenv = {
    enable = true;
    filename = ".env.local";
  };

  # ── Processes (devenv up) ─────────────────────────────────
  processes = {
    dev.exec = "npm run dev";
  };

  # ── Scripts ────────────────────────────────────────────────
  scripts = {
    build = {
      exec = "npm run build";
      description = "Build for production";
    };
    preview = {
      exec = "npm run preview";
      description = "Preview production build";
    };
    check = {
      exec = "npm run check";
      description = "TypeScript type checking";
    };
    lint = {
      exec = "npm run lint";
      description = "Run ESLint";
    };
    lint-fix = {
      exec = "npm run lint:fix";
      description = "Run ESLint with auto-fix";
    };
    fmt = {
      exec = "npm run format";
      description = "Format code with Prettier";
    };
    fmt-check = {
      exec = "npm run format:check";
      description = "Check formatting without writing";
    };
    test = {
      exec = "npm run test";
      description = "Run Vitest unit tests";
    };
    test-e2e = {
      exec = "npm run test:e2e";
      description = "Run Playwright end-to-end tests";
    };
    test-all = {
      exec = "npm run test:all";
      description = "Run unit + e2e tests";
    };
  };

  # ── Pre-commit hooks ───────────────────────────────────────
  git-hooks.hooks = {
    # Formatting
    prettier = {
      enable = true;
      settings = {
        configPath = ".prettierrc";
      };
    };

    # Linting
    eslint.enable = true;

    # Safety
    detect-private-keys.enable = true;
    check-merge-conflicts.enable = true;
    check-case-conflicts.enable = true;
  };

  # ── Shell entry ────────────────────────────────────────────
  enterShell = ''
    echo ""
    echo "  💎 Troves & Coves — Crystal Jewelry Showcase"
    echo ""
    echo "  Node: $(node --version)  npm: $(npm --version)"
    echo ""
    echo "  Scripts: build | preview | check | lint | fmt | test | test-e2e"
    echo "  Dev server: devenv up   or   npm run dev"
    echo ""
  '';
}
