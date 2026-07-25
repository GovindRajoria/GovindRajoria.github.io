import { skills } from "../data/content";
import { Section } from "./Section";

export function Skills() {
  return (
    <Section id="skills" eyebrow="Toolkit" title="Technical skills" subtle>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group) => (
          <div key={group.title}>
            <h3 className="mb-3 flex items-center gap-2 border-b border-border pb-2 text-sm font-semibold text-text">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-accent" />
              {group.title}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item, index) => (
                <li
                  key={item}
                  className="chip rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-text-muted transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                  style={{ animationDelay: `${index * 35}ms` }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
