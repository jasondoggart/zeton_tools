class ProjectHandvalveImport
  include ActiveModel::Model
  require 'roo'

  attr_accessor :file, :project

  def initialize(attributes={})
    attributes.each { |name, valve| send("#{name}=", valve) }
  end

  def persisted
    false
  end

  def save
    if imported_project_handvalves.map(&:valid?).all?
      imported_project_handvalves.each(&:save!)
      true
    else
      imported_project_handvalves.each_with_index do |hv, index|
        hv.errors.full_messages.each do |msg|
          errors.add :base, "Row #{index + 2}: #{msg}"
        end
      end
      false
    end
  end

  def imported_project_handvalves
    @imported_project_handvalves ||= load_imported_project_handvalves
  end

  def load_imported_project_handvalves
    spreadsheet = open_spreadsheet
    header = spreadsheet.row(5)
    (6..spreadsheet.last_row).map do |i|
      row = Hash[[header, spreadsheet.row(i)].transpose]
      handvalve = Handvalve.find_by_id(row["id"]) || Handvalve.new
      handvalve.attributes = row.to_hash
      handvalve.project_id = project
      handvalve
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
