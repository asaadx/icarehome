import { useState } from "react";
import type { Screen } from "./types/domain";
import { useCareLog } from "./hooks/useCareLog";
import { useMedications } from "./hooks/useMedications";
import { useAppointments } from "./hooks/useAppointments";
import { useRoutines } from "./hooks/useRoutines";
import { useCaregivers } from "./hooks/useCaregivers";
import { useHealthEvents } from "./hooks/useHealthEvents";
import Fab from "./components/ui/Fab";
import BottomNav from "./components/layout/BottomNav";
import MoreMenu from "./components/layout/MoreMenu";
import DashboardScreen from "./components/dashboard/DashboardScreen";
import CareLogScreen from "./components/care-log/CareLogScreen";
import MedicationsScreen from "./components/medications/MedicationsScreen";
import AppointmentsScreen from "./components/appointments/AppointmentsScreen";
import CaregiversScreen from "./components/caregivers/CaregiversScreen";
import RoutinesScreen from "./components/routines/RoutinesScreen";
import HealthLogScreen from "./components/health/HealthLogScreen";

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const { log, addLogEntry } = useCareLog();
  const { medications, toggleDose, addMedication, updateMedication, deleteMedication } = useMedications(addLogEntry);
  const { symptoms, incidents, addSymptom, addIncident, updateSymptom, deleteSymptom, updateIncident, deleteIncident } = useHealthEvents(addLogEntry);
  const { routines, addRoutine, updateRoutine, deleteRoutine, toggleRoutineDone, moveRoutine } = useRoutines(addLogEntry);
  const { caregivers, addCaregiver, updateCaregiver, deleteCaregiver } = useCaregivers(addLogEntry);
  const { appointments, addAppointment, updateAppointment, cancelAppointment, completeAppointment } = useAppointments(addLogEntry);
  const { symptoms, incidents, addSymptom, addIncident } = useHealthEvents(addLogEntry);
  const [showMore, setShowMore] = useState(false);
  const [autoOpenKind, setAutoOpenKind] = useState<"symptom" | "incident" | null>(null);

  function reportIncident() {
    setAutoOpenKind("incident");
    setScreen("health");
    setShowMore(false);
  }

  function navigate(next: Screen) {
    setScreen(next);
    setShowMore(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", maxWidth: 480, margin: "0 auto", background: "var(--color-background)", position: "relative" }}>
      {/* Content area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px 100px" }}>
        {screen === "dashboard" && <DashboardScreen medications={medications} symptoms={symptoms} log={log} appointments={appointments} />}
        {screen === "log" && <CareLogScreen log={log} />}
        {screen === "medications" && (
          <MedicationsScreen
            medications={medications}
            onToggleDose={toggleDose}
            onAddMedication={addMedication}
            onUpdateMedication={updateMedication}
            onDeleteMedication={deleteMedication}
          />
        )}
        {screen === "appointments" && (
          <AppointmentsScreen
            appointments={appointments}
            onAddAppointment={addAppointment}
            onUpdateAppointment={updateAppointment}
            onCompleteAppointment={completeAppointment}
            onCancelAppointment={cancelAppointment}
          />
        )}
        {screen === "caregivers" && (
          <CaregiversScreen
            caregivers={caregivers}
            onAddCaregiver={addCaregiver}
            onUpdateCaregiver={updateCaregiver}
            onDeleteCaregiver={deleteCaregiver}
          />
        )}
        {screen === "caregivers" && <CaregiversScreen />}
        {screen === "routines" && (
          <RoutinesScreen
            routines={routines}
            onAddRoutine={addRoutine}
            onUpdateRoutine={updateRoutine}
            onDeleteRoutine={deleteRoutine}
            onToggleRoutineDone={toggleRoutineDone}
            onMoveRoutine={moveRoutine}
          />
        )}
        {screen === "health" && (
          <HealthLogScreen
            symptoms={symptoms}
            incidents={incidents}
            onAddSymptom={addSymptom}
            onAddIncident={addIncident}
            onUpdateSymptom={updateSymptom}
            onDeleteSymptom={deleteSymptom}
            onUpdateIncident={updateIncident}
            onDeleteIncident={deleteIncident}
            autoOpenKind={autoOpenKind}
            onAutoOpenHandled={() => setAutoOpenKind(null)}
          />
        )}
      </div>

      {/* Report incident — round FAB, always reachable without scrolling or navigating */}
      {screen === "dashboard" && (
        <Fab
          onClick={reportIncident}
          color="var(--color-danger)"
          label="Report an incident"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          }
        />
      )}

      {/* More menu overlay */}
      {showMore && <MoreMenu screen={screen} onSelect={navigate} onClose={() => setShowMore(false)} />}

      {/* Bottom tab bar */}
      <BottomNav screen={screen} onNavigate={navigate} showMore={showMore} onToggleMore={() => setShowMore(!showMore)} />
    </div>
  );
}
