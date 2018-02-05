class Project < ApplicationRecord
  validates_presence_of :project_number, :project_name, :client
  has_many :equipment
  has_many :instruments
  has_many :information_requests
  has_many :team_members
  has_many :documents
  belongs_to :user
  after_create :initialize_team_members
  after_create :initialize_documents

  def initialize_team_members
    self.team_members.create(role: "Project Manager")
    self.team_members.create(role: "Project Mentor")
    self.team_members.create(role: "Project Engineer")
    self.team_members.create(role: "Project Engineer")
    self.team_members.create(role: "Draftsperson")
    self.team_members.create(role: "Electrical Engineer")
    self.team_members.create(role: "Controls Engineer")
    self.team_members.create(role: "Skid Fabrication Supervisor")
    self.team_members.create(role: "Mechanical Supervisor")
    self.team_members.create(role: "Electrical Supervisor")
    self.team_members.create(role: "Mechanical Lead Hand")
    self.team_members.create(role: "Electrical Lead Hand")
  end

  def initialize_documents
    self.documents.create(name: "Equipment Layout",
                         phase: "Design Phase",
                         timing: "Structural Design Begins",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "Issued for Structural Analysis",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Skid Fabrication Supervisor"
                         )
    self.documents.create(
                         name: "Equipment Weights",
                         phase: "Design Phase",
                         timing: "Structural Design Begins",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "Issued for Structural Analysis",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Skid Fabrication Supervisor"
                         )
    self.documents.create(
                         name: "Project Design Data for Structural Design",
                         phase: "Design Phase",
                         timing: "Structural Design Begins",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "Issued for Structural Analysis",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Skid Fabrication Supervisor"
                         )
    self.documents.create(
                         name: "P&IDs with Instrument Locations Shown",
                         phase: "Design Phase",
                         timing: "Structural Design Begins",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Issued for Preliminary Design",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Project Team"
                         )
    self.documents.create(
                         name: "Navisworks Model",
                         phase: "Design Phase",
                         timing: "Structural Design Begins",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "Issued for Design",
                         revision_type: "Latest Update",
                         revision_frequency: "Weekly",
                         prepared_by_role: "Drafting Designer",
                         delivered_to_role: "Project Team"
                         )
    self.documents.create(
                         name: "Zeton Pressure Vessel Specification",
                         phase: "Design Phase",
                         timing: "Structural Design Begins",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Issued for Design",
                         revision_type: "Latest Update",
                         revision_frequency: "Once",
                         prepared_by_role: "Project Manager or Engineer",
                         delivered_to_role: "Drafting Designer, Mechanical Engineer"
                         )
    self.documents.create(
                         name: "Frame Drawings",
                         phase: "Design Phase",
                         timing: "Frame Construction",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "Issued for RFQ",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Drafting Designer",
                         delivered_to_role: "Skid Fabrication Supervisor"
                         )
    self.documents.create(
                         name: "Zeton Built Frame Drawings",
                         phase: "Design Phase",
                         timing: "Frame Construction",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "Issued for RFQ",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Drafting Designer",
                         delivered_to_role: "Skid Fabrication Supervisor"
                         )
    self.documents.create(
                         name: "Grating Cut Out Drawings",
                         phase: "Design Phase",
                         timing: "Frame Construction",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "Issued for RFQ",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Drafting Designer",
                         delivered_to_role: "Skid Fabrication Supervisor"
                         )
    self.documents.create(
                         name: "Guardrail Drawings",
                         phase: "Design Phase",
                         timing: "Frame Construction",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "Issued for RFQ",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Drafting Designer",
                         delivered_to_role: "Skid Fabrication Supervisor"
                         )
    self.documents.create(
                         name: "Ladder Drawings",
                         phase: "Design Phase",
                         timing: "Frame Construction",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "Issued for RFQ",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Drafting Designer",
                         delivered_to_role: "Skid Fabrication Supervisor"
                         )
    self.documents.create(
                         name: "Equipment (Vendor GA Drawings or Cutsheets)",
                         phase: "Design Phase",
                         timing: "Procurement of Major Equipment",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Issued for Design",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Drafting Designer"
                         )
    self.documents.create(
                         name: "Pressure Equipment (Vendor GA Drawings or Cutsheets)",
                         phase: "Design Phase",
                         timing: "Procurement of Major Equipment",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Issued for Design",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Drafting Designer"
                         )
    self.documents.create(
                         name: "Equipment (Vendor GA Drawings or Cutsheets)",
                         phase: "Design Phase",
                         timing: "Procurement of Major Equipment",
                         file_location: "",
                         document_type: "Hand Mark Ups",
                         revision_name: "Issued for Design",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Drafting Designer",
                         delivered_to_role: "Project Manager"
                         )
    self.documents.create(
                         name: "Pressure Equipment (Vendor GA Drawings or Cutsheets)",
                         phase: "Design Phase",
                         timing: "Procurement of Major Equipment",
                         file_location: "",
                         document_type: "Hand Mark Ups",
                         revision_name: "Issued for Design",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Drafting Designer",
                         delivered_to_role: "Project Manager"
                         )
    self.documents.create(
                         name: "P&IDs with Instrument Locations Shown",
                         phase: "Design Phase",
                         timing: "Procurement of Major Equipment",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Issued for Design",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Project Team"
                         )
    self.documents.create(
                         name: "Cause and Effect Matrix",
                         phase: "Design Phase",
                         timing: "Procurement Instrumentation",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Issued for Design",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Controls Engineer"
                         )
    self.documents.create(
                         name: "Frame Drawings",
                         phase: "Fabrication Phase",
                         timing: "Frame Fabrication Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Skid Fabrication Supervisor",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Zeton Built Frame Drawings",
                         phase: "Fabrication Phase",
                         timing: "Frame Fabrication Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Skid Fabrication Supervisor",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Grating Cut Out Drawings",
                         phase: "Fabrication Phase",
                         timing: "Frame Fabrication Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Skid Fabrication Supervisor",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Guardrail Drawings",
                         phase: "Fabrication Phase",
                         timing: "Frame Fabrication Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Skid Fabrication Supervisor",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Ladder Drawings",
                         phase: "Fabrication Phase",
                         timing: "Frame Fabrication Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Skid Fabrication Supervisor",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Skid Shipping Brackets",
                         phase: "Fabrication Phase",
                         timing: "Frame Fabrication Begins",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "Hand Mark Ups",
                         revision_frequency: "As Required",
                         prepared_by_role: "Skid Fabrication Supervisor",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Electrical Schematic Diagrams",
                         phase: "Fabrication Phase",
                         timing: "Prior to Cabinet Assembly",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Preliminary Issue",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Electrical Engineer",
                         delivered_to_role: "Electrical Supervisor"
                         )
    self.documents.create(
                         name: "Electrical Schematic Diagrams",
                         phase: "Fabrication Phase",
                         timing: "Prior to Cabinet Assembly",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Preliminary Issue",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Electrical Engineer",
                         delivered_to_role: "Electrical Supervisor"
                         )
    self.documents.create(
                         name: "Electrical Bill of Materials",
                         phase: "Fabrication Phase",
                         timing: "Prior to Cabinet Assembly",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Preliminary Issue",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Electrical Engineer",
                         delivered_to_role: "Electrical Supervisor"
                         )
    self.documents.create(
                         name: "Inline Instrument Dimensions",
                         phase: "Fabrication Phase",
                         timing: "Frame Fabrication Begins",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Preliminary Issue",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Project Engineer",
                         delivered_to_role: "Drafting Designer"
                         )
    self.documents.create(
                         name: "Inline Handvalve Dimensions",
                         phase: "Fabrication Phase",
                         timing: "Frame Fabrication Begins",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Preliminary Issue",
                         revision_type: "New Issue",
                         revision_frequency: "Once",
                         prepared_by_role: "Project Engineer",
                         delivered_to_role: "Drafting Designer"
                         )
    self.documents.create(
                         name: "In Process Inspection",
                         phase: "Fabrication Phase",
                         timing: "Frame Fabrication Begins",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "Preliminary Issue",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Skid Fabrication Supervisor",
                         delivered_to_role: "Project Manager"
                         )
    self.documents.create(
                         name: "ISO Summary Project Checklist",
                         phase: "Fabrication Phase",
                         timing: "Installation of Equipment Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "PFDs",
                         phase: "Fabrication Phase",
                         timing: "Installation of Equipment Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Navisworks Model",
                         phase: "Fabrication Phase",
                         timing: "Installation of Equipment Begins",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "Latest Issue",
                         revision_type: "Latest Issue",
                         revision_frequency: "Weekly",
                         prepared_by_role: "Drafting Designer",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "2D Layout with Dimensions, Cable Tray Layout, and Laydown Side",
                         phase: "Fabrication Phase",
                         timing: "Installation of Equipment Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued For Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Drafting Designer",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Zeton Built Equipment",
                         phase: "Fabrication Phase",
                         timing: "Installation of Equipment Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued For Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Equipment Vendor GA Drawings or Cutsheets",
                         phase: "Fabrication Phase",
                         timing: "Installation of Equipment Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued For Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Equipment Stands",
                         phase: "Fabrication Phase",
                         timing: "Installation of Equipment Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued For Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Drafting Designer",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Equipment Shipping Brackets",
                         phase: "Fabrication Phase",
                         timing: "Installation of Equipment Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued For Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Skid Fabrication Supervisor",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Electrical Schematic Diagrams",
                         phase: "Fabrication Phase",
                         timing: "Cabinet Assembly",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued For Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Electrical Engineer",
                         delivered_to_role: "Electrical Supervisor"
                         )
    self.documents.create(
                         name: "Package Drawings (Mechanical)",
                         phase: "Fabrication Phase",
                         timing: "Installation of Equipment Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued For Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Special Equipment Instructions",
                         phase: "Fabrication Phase",
                         timing: "Installation of Equipment Begins",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Issued For Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "In Process Inspection (Major Equipment)",
                         phase: "Fabrication Phase",
                         timing: "Mounting and Pluming of Valves, Instruments, Pipe, and Tube Begins",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "",
                         revision_type: "",
                         revision_frequency: "",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "QA Manager"
                         )
    self.documents.create(
                         name: "PID Change Log",
                         phase: "Fabrication Phase",
                         timing: "Mounting and Pluming of Valves, Instruments, Pipe, and Tube Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "Hand Mark Ups",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Tubing Line List and Inspection Records",
                         phase: "Fabrication Phase",
                         timing: "Mounting and Pluming of Valves, Instruments, Pipe, and Tube Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "Hand Mark Ups",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Piping Line List",
                         phase: "Fabrication Phase",
                         timing: "Mounting and Pluming of Valves, Instruments, Pipe, and Tube Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "Hand Mark Ups",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Pipe Specifications",
                         phase: "Fabrication Phase",
                         timing: "Mounting and Pluming of Valves, Instruments, Pipe, and Tube Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Isometrics",
                         phase: "Fabrication Phase",
                         timing: "Mounting and Pluming of Valves, Instruments, Pipe, and Tube Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Engineered Pipe Support List",
                         phase: "Fabrication Phase",
                         timing: "Mounting and Pluming of Valves, Instruments, Pipe, and Tube Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Pipe Stress Designer",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Heat Trace Plan",
                         phase: "Fabrication Phase",
                         timing: "Mounting and Pluming of Valves, Instruments, Pipe, and Tube Begins",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Engineer",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Electrical Schematics Diagrams",
                         phase: "Fabrication Phase",
                         timing: "Skid Wiring",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "Issued for Construction",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Electrical Designer",
                         delivered_to_role: "Electrical Supervisor"
                         )
    self.documents.create(
                         name: "Metrics",
                         phase: "Fabrication Phase",
                         timing: "Mounting and Pluming of Valves, Instruments, Pipe, and Tube Begins",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "",
                         revision_type: "Digital",
                         revision_frequency: "Weekly",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Metrics",
                         phase: "Fabrication Phase",
                         timing: "Mounting and Pluming of Valves, Instruments, Pipe, and Tube Begins",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "",
                         revision_type: "Digital",
                         revision_frequency: "Weekly",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Bill of Materials",
                         phase: "Fabrication Phase",
                         timing: "Mounting and Pluming of Valves, Instruments, Pipe, and Tube Begins",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "",
                         revision_type: "Hand Mark Ups",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Project Schedule",
                         phase: "Fabrication Phase",
                         timing: "Mounting and Pluming of Valves, Instruments, Pipe, and Tube Begins",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "Weekly",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "Special Instrument Installation Instructions",
                         phase: "Fabrication Phase",
                         timing: "Mounting and Pluming of Valves, Instruments, Pipe, and Tube Begins",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Mechanical Supervisor"
                         )
    self.documents.create(
                         name: "I/O Testing Records",
                         phase: "Fabrication Phase",
                         timing: "Pre-FAT and Pre-Disassembly",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Electrical Supervisor",
                         delivered_to_role: "Electrical Engineer"
                         )
    self.documents.create(
                         name: "Electrical Testing Report",
                         phase: "Fabrication Phase",
                         timing: "Pre-FAT and Pre-Disassembly",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Electrical Supervisor"
                         )
    self.documents.create(
                         name: "Megger Test Records",
                         phase: "Fabrication Phase",
                         timing: "Pre-FAT and Pre-Disassembly",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Electrical Supervisor"
                         )
    self.documents.create(
                         name: "Signed Isometrics",
                         phase: "Fabrication Phase",
                         timing: "Pre-FAT and Pre-Disassembly",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Mechanical Supervisor",
                         delivered_to_role: "Project Manager"
                         )
    self.documents.create(
                         name: "Completed Tubing Inspection Records",
                         phase: "Fabrication Phase",
                         timing: "Pre-FAT and Pre-Disassembly",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Mechanical Supervisor",
                         delivered_to_role: "Project Manager"
                         )
    self.documents.create(
                         name: "Heat Trace Plan As-Built",
                         phase: "Fabrication Phase",
                         timing: "Pre-FAT and Pre-Disassembly",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Electrical Supervisor",
                         delivered_to_role: "Project Manager"
                         )
    self.documents.create(
                         name: "Electrical Schematic Diagrams As-Built",
                         phase: "Fabrication Phase",
                         timing: "Pre-FAT and Pre-Disassembly",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Electrical Supervisor",
                         delivered_to_role: "Electrical Engineer"
                         )
    self.documents.create(
                         name: "Cause and Effect Test Records",
                         phase: "Fabrication Phase",
                         timing: "Pre-FAT and Pre-Disassembly",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Controls Engineer",
                         delivered_to_role: "Project Manager"
                         )
    self.documents.create(
                         name: "Packing List of Spares and Loose Items for Shipping",
                         phase: "Fabrication Phase",
                         timing: "Pre-FAT and Pre-Disassembly",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Mechanical/Electrical Supervisor",
                         delivered_to_role: "Project Manager"
                         )
    self.documents.create(
                         name: "Special Reassembly Instructions and Guidelines",
                         phase: "Fabrication Phase",
                         timing: "Pre-FAT and Pre-Disassembly",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Mechanical/Electrical Supervisor",
                         delivered_to_role: "Project Manager"
                         )
    self.documents.create(
                         name: "P&IDs Change Log",
                         phase: "Fabrication Phase",
                         timing: "As-built Walkthrough and Check",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Mechanical/Electrical Supervisor",
                         delivered_to_role: "Project Manager"
                         )
    self.documents.create(
                         name: "Engineered Pipe Support List",
                         phase: "Fabrication Phase",
                         timing: "As-built Walkthrough and Check",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Pipe Stress Designer",
                         delivered_to_role: "Project Manager"
                         )
    self.documents.create(
                         name: "Skid Shipping Brackets",
                         phase: "Fabrication Phase",
                         timing: "As-built Walkthrough and Check",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Skid Fabrication Supervisor",
                         delivered_to_role: "Project Manager"
                         )
    self.documents.create(
                         name: "Equipment Shipping Brackets",
                         phase: "Fabrication Phase",
                         timing: "As-built Walkthrough and Check",
                         file_location: "",
                         document_type: "Yellow Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Skid Fabrication Supervisor",
                         delivered_to_role: "Project Manager"
                         )
    self.documents.create(
                         name: "Critical Lift Meeting",
                         phase: "Shipping Phase",
                         timing: "Frame Disassembly",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Plant Manager"
                         )
    self.documents.create(
                         name: "Shipping Checklist",
                         phase: "Shipping Phase",
                         timing: "Frame Disassembly",
                         file_location: "",
                         document_type: "White Copy",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "Plant Manager"
                         )
    self.documents.create(
                         name: "Statistics",
                         phase: "Shipping Phase",
                         timing: "Project Shipped",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "VP Operations"
                         )
    self.documents.create(
                         name: "Post Project Meeting Minutes",
                         phase: "Shipping Phase",
                         timing: "Project Shipped",
                         file_location: "",
                         document_type: "Electronic",
                         revision_name: "",
                         revision_type: "New Issue",
                         revision_frequency: "As Required",
                         prepared_by_role: "Project Manager",
                         delivered_to_role: "VP Operations"
                         )

  end
end
