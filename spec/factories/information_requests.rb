FactoryBot.define do
  factory :information_request do
    zeton_clarification "we need clarification"
    answered 0
    instruments {[FactoryBot.create(:instrument)]}
    equipment {[FactoryBot.create(:equipment)]}
    project
  end
end
