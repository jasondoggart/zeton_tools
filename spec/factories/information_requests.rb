FactoryBot.define do
  factory :information_request do
    client_document_number "Spec-1234"
    client_document_title "Client spec"
    client_document_revision "1"
    client_document_section "1.3.2"
    zeton_clarification "we need clarification"
    answered 0
    instruments {[FactoryBot.create(:instrument)]}
    equipment {[FactoryBot.create(:equipment)]}
  end
end
