# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name          = "explorers-portfolio-theme"
  spec.version       = "0.1.0"
  spec.authors       = ["James Kitchens"]
  spec.email         = ["40303683+kitchensjn@users.noreply.github.com"]

  spec.summary       = "This is a personal portfolio website theme."
  spec.homepage      = "https://www.github.com/kitchensjn/explorers-portfolio-theme"
  spec.license       = "MIT"

  spec.files         = `git ls-files -z`.split("\x0").select { |f| f.match(%r!^(assets/CV|assets/logo|assets/scripts|assets/styles|_layouts|_includes|_sass|_blog|_projects|LICENSE|README|_config\.yml)!i) }

  spec.add_runtime_dependency "jekyll", "~> 4.2"
end
