# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

# Create project managers
User.create(first_name: "Jason", last_name: "Doggart", email: "jdoggart@zeton.com", password: "password")
puts "Created Jason Doggart"
User.create(first_name: "John", last_name: "Onesi", email: "jonesi@zeton.com", password: "password")
puts "Created John Onesi"
User.create(first_name: "Oliver", last_name: "Orrell", email: "oorrell@zeton.com", password: "password")
puts "Created Oliver Orrell"
User.create(first_name: "Ian", last_name: "Jessop", email: "ijessop@zeton.com", password: "password")
puts "Created Ian Jessop"
User.create(first_name: "Danielle", last_name: "DeSousa", email: "ddesousa@zeton.com", password: "password")
puts "Created Danielle De Sousa"
User.create(first_name: "Pallavi", last_name: "Dziewa", email: "pdziewa@zeton.com", password: "password")
puts "Created Pallavi Dziewa"
User.create(first_name: "Nigel", last_name: "Semegen", email: "nsemegen@zeton.com", password: "password")
puts "Created Nigel Semegen"
User.create(first_name: "Paul", last_name: "Martin", email: "pmartin@zeton.com", password: "password")
puts "Created Paul Martin"
User.create(first_name: "Mike", last_name: "Trainor", email: "mtrainor@zeton.com", password: "password")
puts "Created Mike Trainor"

# Create project for each project manager
User.all.each do |user| 
  project_number = Faker::Number.number(3) + "-" + Faker::Number.number(2)
  project_name = Faker::Science.element + " From Biomass"
  client = Faker::Science.scientist
  user.projects.create(project_number: project_number, project_name: project_name, client: client)
  puts "Created project number #{Project.last.project_number}"
end

# Create other project roles
User.create(first_name: "Matt", last_name: "Twynstra", email: "mtwynstra@zeton.com", password: "password")
puts "Created Matt Twynstra"
User.create(first_name: "Ed", last_name: "De Rubeis", email: "ederubeis@zeton.com", password: "password")
puts "Created Ed De Rubeis"
User.create(first_name: "John", last_name: "Grieve", email: "jgrieve@zeton.com", password: "password")
puts "Created John Grieve"
User.create(first_name: "Mark", last_name: "Pulcine", email: "mpulcine@zeton.com", password: "password")
puts "Created Mark Pulcine"
User.create(first_name: "William", last_name: "Beckley", email: "wbeckley@zeton.com", password: "password")
puts "Created William Beckley"
User.create(first_name: "Leisl", last_name: "Dukhedin-Lalla", email: "ldukhedin@zeton.com", password: "password")
puts "Created Leisl Dukhedin-Lalla"

# Create all team members
n = User.count
Project.all.each do |project|
  project.team_members.create(role: "Frame Fabrication Supervisor", user: User.find_by(email: "mtwynstra@zeton.com"))
  project.team_members.create(role: "VP Operations", user: User.find_by(email: "ldukhedin@zeton.com"))
  project.team_members.create(role: "Mechanical Supervisor", user: User.find_by(email: "mpulcine@zeton.com"))
  project.team_members.create(role: "Electrical Supervisor", user: User.find_by(email: "wbeckley@zeton.com"))
  project.team_members.create(role: "Mechanical Engineer", user: User.find_by(email: "ederubeis@zeton.com"))
  project.team_members.create(role: "Plant Manager", user: User.find_by(email: "jgrieve@zeton.com"))
  project.team_members.create(role: "Project Engineer", user: User.find(n))
  project.team_members.create(role: "Project Engineer", user: User.find_by(email: "jdoggart@zeton.com"))
  n = n - 1
  puts "Added #{project.team_members.count} team members to project #{project.project_number}"
end


inst_types = ["AE", "FIT", "FI", "FV", "LIT", "LI", "LV", "PI", "PIT", "PV", "PSV", "PSE", "SE", "TI", "TE", "TV", "TY", "VT", "XY", "XV", "ZSC", "ZSO", "FY", "PY", "LY"]
equip_types = ["V", "P", "C", "B", "X"]

# Create instruments and equipment for all projects
Project.all.each do |project|
  num_inst = rand(75..700)
  puts "Will generate #{num_inst} instruments for project #{project.project_number}"
  num_inst.times do
    project.instruments.create(type_code: inst_types[rand(inst_types.length)], loop: Faker::Number.number(4), scope: "Zeton")
  end
  puts "Generated #{project.instruments.count} instruments"

  num_equip = rand(5..150)
  puts "Will generate #{num_equip} pieces of equipment for project #{project.project_number}"
  num_equip.times do
    tag = equip_types[rand(equip_types.length)]
    if tag == "V"
      equip_type = "Vessel"
    elsif tag == "P"
      equip_type = "Pump"
    elsif tag == "C"
      equip_type = "Compressor"
    elsif tag == "B"
      equip_type = "Blower"
    elsif tag == "X"
      equip_type = "Packaged Unit"
    end
    project.equipment.create(tag: tag + "-" + Faker::Number.number(3) , description: "Very Important Piece of Equipment", equipment_type: equip_type, scope: "Zeton")
  end
  puts "Generated #{project.equipment.count} pieces of equipment"
end

# Fill in metrics for all instruments
odds = [1,1,1,1,1,1,1,1,1,0]

Project.all.each do |project|
  puts "Updating Instrument Metrics for project #{project.id} of #{Project.count}"
  project.instruments.each do |inst|
    inst.datasheet_submitted_for_approval = odds.sample
    if inst.datasheet_submitted_for_approval == 1
      inst.datasheet_approved = odds.sample
      if inst.datasheet_approved == 1
        inst.rfq_sent = odds.sample
        if inst.rfq_sent == 1
          inst.po_placed = odds.sample
          if inst.po_placed == 1
            inst.item_received = odds.sample
            if inst.item_received == 1
              inst.item_inspected_and_released = odds.sample
              if inst.item_inspected_and_released == 1
                inst.mounted_by_mechanical = odds.sample
                if inst.mounted_by_mechanical == 1
                  inst.plumbed_by_mechanical = odds.sample
                  if inst.plumbed_by_mechanical == 1
                    inst.cable_pulled = odds.sample
                    if inst.cable_pulled == 1
                      inst.cable_terminated_at_source = odds.sample
                      if inst.cable_terminated_at_source == 1
                        inst.cable_terminated_at_destination = odds.sample
                        if inst.cable_terminated_at_destination == 1
                          inst.continuity_tested = odds.sample
                          if inst.continuity_tested == 1
                            inst.grounded_by_electrical = odds.sample
                            if inst.grounded_by_electrical == 1
                              inst.checked_by_eng = odds.sample
                            end
                          end
                        end
                      end
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
    inst.save
  end
  puts "Completed instrument metrics"
end

# Fill in metrics for all equipment

Project.all.each do |project|
  puts "Filling in metrics for project #{project.id} of #{Project.count}"
  project.equipment.each do |equip|
    equip.datasheet_complete = odds.sample
    if equip.datasheet_complete == 1
      equip.datasheet_released = odds.sample
      if equip.datasheet_released == 1
        equip.rfq_sent = odds.sample
        if equip.rfq_sent == 1
          equip.po_placed = odds.sample
          if equip.po_placed == 1
            equip.drawing_for_approval_received = odds.sample
            if equip.drawing_for_approval_received == 1
              equip.drawing_for_approval_marked_up = odds.sample
              if equip.drawing_for_approval_marked_up == 1
                equip.drawing_for_approval_sent_to_client = odds.sample
                if equip.drawing_for_approval_sent_to_client == 1
                  equip.drawing_for_approval_released_for_construction = odds.sample
                  if equip.drawing_for_approval_released_for_construction == 1
                    equip.item_received_at_zeton = odds.sample
                    if equip.item_received_at_zeton == 1
                      equip.item_inspected_and_released = odds.sample
                      if equip.item_inspected_and_released == 1
                        equip.item_installed_by_mech = odds.sample
                        if equip.item_installed_by_mech == 1
                          equip.item_grounded_by_elec = odds.sample
                          if equip.item_grounded_by_elec == 1
                            equip.item_inspected_by_eng = odds.sample
                          end
                        end
                      end
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
    equip.save
  end
    puts "Completed Equipment Metrics"
end

# Add project RFI's

Project.all.each do |project|
  puts "creating rfis for project #{project.id} of #{Project.count}"
  num_rfis = rand(15..200)
  puts "will create #{num_rfis} for project #{project.id}"
  num_rfis.times do
    doc_number = "CLIENT-DOC-" + Faker::Number.number(4)
    doc_title = "Super Awesome Client Specfication"
    doc_rev = "1.2"
    zeton_clarification = Faker::Lorem.paragraph(3)
    project.information_requests.create(client_document_number: doc_number,
                             client_document_title: doc_title,
                             client_document_revision: doc_rev,
                             client_document_section: "1.3.5",
                             zeton_clarification: zeton_clarification)
    # add instrument associations
    num_assoc_inst = rand(0..3)
    num_assoc_inst.times do
      project.information_requests.last.instruments << project.instruments.sample
    end

    # add equipmebt associations
    num_assoc_equip = rand(0..2)
    num_assoc_equip.times do
      project.information_requests.last.equipment << project.equipment.sample
    end
  end
end

# add RFI responses
organizations = ["Client", "Zeton"]
Project.all.each do |project|
  puts "creating rfi responses for project #{project.id} of #{Project.count}"
  project.information_requests.each do |rfi|
    num_responses = rand(0..3)
    num_responses.times do
      organization = organizations.sample
      responder = Faker::Name.name
      response_text = Faker::Lorem.paragraph(2)
      rfi.rfi_responses.create(organization: organization, responder: responder, response: response_text)
    end
  end
end
