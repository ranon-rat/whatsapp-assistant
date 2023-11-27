{ pkgs }: {
  deps = [
    pkgs.bashInteractive
    pkgs.nodePackages.bash-language-server
    pkgs.man
    pkgs.nodejs_20
    pkgs.nodePackages.typescript-language-server
    pkgs.yarn
  ];
}