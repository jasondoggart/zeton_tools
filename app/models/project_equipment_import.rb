class ProjectEquipmentImport
  include ActiveModel::Model
  require 'roo'

  attr_accessor :file, :project

  def initialize(attributes={})
    attributes.each { |name, value| send("#{name}=", value) }
  end

  def persisted?
    false
  end

  def save 
    if imported_project_equipment.map(&:valid?).all?
      imported_project_equipment.each(&:save!)
    else
      imported_project_equipment.each_with_index do |equip, index|
        equip.errors.full_messages.each do |msg|
          errors.add :base, "Row #{index + 2}: #{msg}"
        end
      end
      false
    end
  end

  def imported_project_equipment
    @imported_project_equipment ||= load_imported_project_equipment
  end

  def load_imported_project_equipment
    spreadsheet = open_spreadsheet
    header = spreadsheet.row(5)
    (6..spreadsheet.last_row).map do |i|
      row = Hash[[header, spreadsheet.row(i)].transpose]
      equipment = Equipment.find_by_id(row["id"]) || Equipment.new
      equipment.attributes = row.to_hash
      equipment.project_id = project
      equipment
    end
  end

  def open_spreadsheet
    case File.extname(file.original_filename)
    when ".csv" then Csv.new(file.path, nil, :ignore)
    when ".xls" then Roo::Excel.new(file.path, nil, :ignore)
    when ".xlsx" then Roo::Excelx.new(file.path)
    else raise "Unknown file type: #{file.original_filename}"
    end
  end
end
