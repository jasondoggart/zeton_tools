FactoryBot.define do
  factory :information_request do
    zeton_clarification "we need clarification"
    answered 0
    instruments {[FactoryBot.create(:instrument)]}
    equipment {[FactoryBot.create(:equipment)]}
    target_date Time.now
    project
    client_document
    client_team_member
  end
end
