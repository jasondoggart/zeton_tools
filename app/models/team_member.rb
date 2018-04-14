class TeamMember < ApplicationRecord
  belongs_to :user, optional: true
  belongs_to :project

  def full_name
    user.first_name + ' ' + user.last_name
  end
end
