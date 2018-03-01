FactoryBot.define do
  factory :action_item do
    priority 1
    area "MyString"
    title "MyText"
    target_date "2018-02-19 11:01:40"
    completion_date nil
    sent_by "MyString"
    description "MyString"
    project
    association :creator, factory: :user
    association :assigned_to, factory: :user
    status 0
  end
end
