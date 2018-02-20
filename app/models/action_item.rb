class ActionItem < ApplicationRecord
  validates_presence_of :area, :title, :description
  belongs_to :project

  def ai_number
    'ZET-AI-' + id.to_s
  end
end
