class TeamMember < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :project
end
