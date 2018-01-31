FactoryBot.define do
  sequence :email do |n|
    "user#{n}@example.com"
  end

  sequence :first_name do |m|
    "first#{m}"
  end

  sequence :last_name do |o|
    "last#{o}"
  end

  factory :user do
    first_name
    last_name
    email
    password "password"
  end
end
