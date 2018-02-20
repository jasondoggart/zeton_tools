FactoryBot.define do
  factory :action_item do
    priority 1
    area "MyString"
    title "MyText"
    target_date "2018-02-19 11:01:40"
    completion_date "2018-02-19 11:01:40"
    sent_by "MyString"
    description "MyString"
    project
  end
end
