FactoryBot.define do
  factory :project do
    project_number "123-45"
    project_name "A project"
    client "A Client"
    user
  end
end
