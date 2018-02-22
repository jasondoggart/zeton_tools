class ActionItem < ApplicationRecord
  validates_presence_of :area, :title, :description
  belongs_to :project
  belongs_to :creator, class_name: "User"
  belongs_to :assigned_to, class_name: "User", optional: true
  has_and_belongs_to_many :instruments
  has_and_belongs_to_many :equipment
  has_and_belongs_to_many :handvalves


  def ai_number
    'ZET-AI-' + id.to_s
  end
end
